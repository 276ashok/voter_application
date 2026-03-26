from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class ElectionData(Base):
    __tablename__ = "election_data"

    id = Column(Integer, primary_key=True, index=True)
    serial_no = Column(Integer, nullable=True)
    part_no = Column(Integer, nullable=True)
    ward_no = Column(Integer, nullable=True)
    street = Column(Text, nullable=True)
    vote_count = Column(Integer, nullable=True)
    booth_address = Column(Text, nullable=True)
    voter_area = Column(Text, nullable=True)
    male_count = Column(Integer, nullable=True)
    female_count = Column(Integer, nullable=True)
    other_count = Column(Integer, nullable=True)
    total_voters = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
