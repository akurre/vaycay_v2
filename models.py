from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from utils.config import Configuration as cfg

Base = declarative_base()

class WeatherData_model(Base):
    __tablename__ = cfg.table_name
    id = Column(String, index=True, nullable=False, primary_key=True)
    name = Column(String, index=True, nullable=False, primary_key=True)
    lat = Column(String, index=True, nullable=False, primary_key=True)
    long = Column(String, index=True, nullable=False, primary_key=True)
    date = Column(String, index=True, nullable=False, primary_key=True)
    prcp = Column(String)
    snow = Column(String)
    tmax = Column(Float)
    tmin = Column(Float)
    tavg = Column(Float)
    population = Column(Integer)
    country = Column(String)

    class Config:
        orm_mode = True
