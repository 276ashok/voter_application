import pandas as pd
import numpy as np
import io
from sqlalchemy.orm import Session
from models import ElectionData

def process_and_save_excel(file_content: bytes, filename: str, db: Session):
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_content))
        else:
            df = pd.read_excel(io.BytesIO(file_content))
    except Exception as e:
        raise ValueError(f"Could not read file: {str(e)}")
        
    # Clean column names by stripping whitespace
    df.columns = df.columns.astype(str).str.strip()
    
    # Define mapping from Tamil (or slightly variated) to English fields
    col_mapping = {
        'வ எண்': 'serial_no',
        'பாகம் எண்': 'part_no',
        'வார்டு எண்': 'ward_no',
        'வாக்குச்சாவடி அமைவிடம்/முகவரி': 'booth_address',
        'தெரு': 'street',
        'வாக்கு': 'vote_count',
        'வாக்காளர் பகுதி': 'voter_area',
        'ஆண்': 'male_count',
        'பெண்': 'female_count',
        'இதரர்': 'other_count',
        'மொத்த வாக்காளர்': 'total_voters'
    }
    
    # Try to map what we can (partial matching to handle typos)
    mapped_columns = {}
    for col in df.columns:
        for tamil_key, eng_key in col_mapping.items():
            if tamil_key in col:
                mapped_columns[col] = eng_key
                break
                
    if not mapped_columns:
        raise ValueError("Could not find any of the required Tamil columns in the uploaded file.")
        
    df = df.rename(columns=mapped_columns)
    
    # Filter only the columns we care about that actually exist
    valid_cols = [col for col in col_mapping.values() if col in df.columns]
    # Deduplicate in case multiple tamil keys hit the same english key
    valid_cols = list(dict.fromkeys(valid_cols))
    df = df[valid_cols]
    
    # Clean data
    # Drop rows where all the mapped columns are NaN
    df = df.dropna(how='all')
    
    # Forward-fill merged cells 
    ffill_cols = [c for c in ['serial_no', 'part_no', 'ward_no', 'street', 'booth_address', 'voter_area'] if c in df.columns]
    df[ffill_cols] = df[ffill_cols].ffill()
    
    # Convert numeric fields safely
    numeric_cols = ['serial_no', 'part_no', 'ward_no', 'vote_count', 'male_count', 'female_count', 'other_count', 'total_voters']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
            
    # Calculate / Ensure total_voters match (male + female + other)
    if all(c in df.columns for c in ['male_count', 'female_count', 'other_count']):
        df['total_voters'] = df['male_count'] + df['female_count'] + df['other_count']
    
    # Replace remaining NaNs with None for SQLite insertion compatibility
    df = df.replace({np.nan: None})
    
    # Insert records into DB in bulk
    records_to_insert = df.to_dict(orient='records')
    
    db_items = [ElectionData(**record) for record in records_to_insert]
    
    try:
        db.bulk_save_objects(db_items)
        db.commit()
    except Exception as e:
        db.rollback()
        raise ValueError(f"Database error: {str(e)}")
        
    return len(db_items)
