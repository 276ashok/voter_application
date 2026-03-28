from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RecordCreate(BaseModel):
    ward_no: int
    part_no: int
    street: str
    vote_count: Optional[int] = None
    serial_no: Optional[int] = None
    booth_address: Optional[str] = None
    voter_area: Optional[str] = None
    male_count: Optional[int] = 0
    female_count: Optional[int] = 0
    other_count: Optional[int] = 0

class RecordResponse(RecordCreate):
    id: int
    total_voters: Optional[int] = 0
    created_at: datetime

    class Config:
        from_attributes = True

class AggregationsModel(BaseModel):
    total_votes: int
    total_male: int
    total_female: int
    total_others: int
    grand_total: int

class PaginatedResponse(BaseModel):
    total_records: int
    current_page: int
    data: List[RecordResponse]
    aggregations: AggregationsModel

class SummaryResponse(BaseModel):
    total_records: int
    total_voters: int
    total_male: int
    total_female: int

class ChartDataPoint(BaseModel):
    name: str
    value: int

class DashboardAnalyticsResponse(BaseModel):
    gender_distribution: List[ChartDataPoint]
    ward_distribution: List[ChartDataPoint]
    top_areas: List[ChartDataPoint]
