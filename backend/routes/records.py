from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import ElectionData
from schemas import RecordCreate, RecordResponse, PaginatedResponse, SummaryResponse, DashboardAnalyticsResponse
from typing import List, Optional
from sqlalchemy import func, or_

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

@router.get("/analytics", response_model=DashboardAnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    gender_agg = db.query(
        func.sum(ElectionData.male_count),
        func.sum(ElectionData.female_count),
        func.sum(ElectionData.other_count)
    ).first()
    
    gender_distribution = [
        {"name": "Male", "value": gender_agg[0] or 0},
        {"name": "Female", "value": gender_agg[1] or 0},
        {"name": "Other", "value": gender_agg[2] or 0}
    ]

    ward_agg = db.query(
        ElectionData.ward_no,
        func.sum(ElectionData.total_voters)
    ).group_by(ElectionData.ward_no).order_by(func.sum(ElectionData.total_voters).desc()).all()
    
    ward_distribution = [
        {"name": f"Ward {row[0]}", "value": row[1] or 0} for row in ward_agg if row[1]
    ]

    area_agg = db.query(
        ElectionData.voter_area,
        func.sum(ElectionData.total_voters)
    ).group_by(ElectionData.voter_area).order_by(func.sum(ElectionData.total_voters).desc()).all()

    top_areas = [
        {"name": row[0] if row[0] else "Unknown", "value": row[1] or 0} for row in area_agg if row[1]
    ]

    return {
        "gender_distribution": gender_distribution,
        "ward_distribution": ward_distribution,
        "top_areas": top_areas
    }

@router.get("", response_model=PaginatedResponse)
def get_records(
    page: int = Query(1, ge=1), 
    limit: int = Query(20, ge=1, le=100), 
    search: Optional[str] = None,
    ward: Optional[int] = None,
    part: Optional[int] = None,
    street: Optional[str] = None,
    area: Optional[str] = None,
    min_votes: Optional[int] = None,
    max_votes: Optional[int] = None,
    min_total: Optional[int] = None,
    max_total: Optional[int] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    query = db.query(ElectionData)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                ElectionData.street.ilike(search_term),
                ElectionData.voter_area.ilike(search_term),
                ElectionData.booth_address.ilike(search_term)
            )
        )
        
    if ward is not None:
        query = query.filter(ElectionData.ward_no == ward)
    if part is not None:
        query = query.filter(ElectionData.part_no == part)
        
    if street:
        query = query.filter(ElectionData.street.ilike(f"%{street}%"))
    if area:
        query = query.filter(ElectionData.voter_area.ilike(f"%{area}%"))
        
    if min_votes is not None:
        query = query.filter(ElectionData.vote_count >= min_votes)
    if max_votes is not None:
        query = query.filter(ElectionData.vote_count <= max_votes)
        
    if min_total is not None:
        query = query.filter(ElectionData.total_voters >= min_total)
    if max_total is not None:
        query = query.filter(ElectionData.total_voters <= max_total)
        
    total = query.count()
    
    agg_result = query.with_entities(
        func.sum(ElectionData.vote_count),
        func.sum(ElectionData.male_count),
        func.sum(ElectionData.female_count),
        func.sum(ElectionData.other_count),
        func.sum(ElectionData.total_voters)
    ).first()
    
    aggregations = {
        "total_votes": agg_result[0] or 0 if agg_result else 0,
        "total_male": agg_result[1] or 0 if agg_result else 0,
        "total_female": agg_result[2] or 0 if agg_result else 0,
        "total_others": agg_result[3] or 0 if agg_result else 0,
        "grand_total": agg_result[4] or 0 if agg_result else 0
    }
    
    records = query.offset(skip).limit(limit).all()
    
    return {
        "total_records": total,
        "current_page": page,
        "data": records,
        "aggregations": aggregations
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

@router.put("/{record_id}", response_model=RecordResponse)
def update_record(record_id: int, record: RecordCreate, db: Session = Depends(get_db)):
    db_record = db.query(ElectionData).filter(ElectionData.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    total = (record.male_count or 0) + (record.female_count or 0) + (record.other_count or 0)
    
    update_data = record.model_dump()
    update_data['total_voters'] = total
    
    for key, value in update_data.items():
        setattr(db_record, key, value)
        
    db.commit()
    db.refresh(db_record)
    return db_record

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(ElectionData).filter(ElectionData.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}
