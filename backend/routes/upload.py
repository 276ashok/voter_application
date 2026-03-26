from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services.excel_parser import process_and_save_excel

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not (file.filename.endswith('.xlsx') or file.filename.endswith('.xls') or file.filename.endswith('.csv')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .xlsx, .xls, or .csv")
        
    try:
        contents = await file.read()
        records_added = process_and_save_excel(contents, file.filename, db)
        return {"message": "File processed successfully", "records_added": records_added}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
