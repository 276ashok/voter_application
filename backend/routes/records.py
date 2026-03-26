from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import ElectionData
from schemas import RecordCreate, RecordResponse, PaginatedResponse, SummaryResponse
from typing import List
from sqlalchemy import func

router = APIRouter(prefix="/records", tags=["Records"])

@router.get("/summary", response_model=SummaryResponse)
def get_summary(db: Session = Depends(get_db)):
    total_records = db.query(ElectionData).count()
    aggregates = db.query(
        func.sum(ElectionData.total_voters),
        func.sum(ElectionData.male_count),
        func.sum(ElectionData.female_count)
    ).first()
    
    return {
        "total_records": total_records,
        "total_voters": aggregates[0] or 0 if aggregates else 0,
        "total_male": aggregates[1] or 0 if aggregates else 0,
        "total_female": aggregates[2] or 0 if aggregates else 0
    }

@router.get("", response_model=PaginatedResponse)
def get_records(page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    skip = (page - 1) * limit
    total = db.query(ElectionData).count()
    records = db.query(ElectionData).offset(skip).limit(limit).all()
    
    return {
        "total_records": total,
        "current_page": page,
        "data": records
    }

@router.post("", response_model=RecordResponse)
def create_record(record: RecordCreate, db: Session = Depends(get_db)):
    total = (record.male_count or 0) + (record.female_count or 0) + (record.other_count or 0)
    
    db_record = ElectionData(
        **record.model_dump(),
        total_voters=total
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return db_record
