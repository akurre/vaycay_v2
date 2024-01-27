from sqlalchemy import Column, Date, Float, Integer, String
from vaycay.utils.config import Configuration as cfg
from vaycay.db.base_class import Base


class WeatherDataModel(Base):
    __tablename__ = cfg.table_name
    city = Column(String, nullable=False, primary_key=True)
    country = Column(String)
    date = Column(Date, index=True, nullable=False, primary_key=True)
    lat = Column(String)
    long = Column(String)
    precipitation = Column(Float)
    avg_temp = Column(Float)
    max_temp = Column(Float)
    min_temp = Column(Float)
    population = Column(Integer)
    name = Column(String, index=True,  primary_key=True)
    submitter_id = Column(String)

    class Config:
        orm_mode = True
