from sqlalchemy import Column, Date, Float, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from utils.config import Configuration as cfg
from app.database.base_class import Base


class weather_data_model(Base):
    __tablename__ = cfg.table_name
    city = Column(String, nullable=False, primary_key=True)
    country = Column(String)
    date = Column(Date, index=True, nullable=False, primary_key=True)
    lat = Column(String)
    long = Column(String)
    PRCP = Column(Float)
    TAVG = Column(Float)
    TMAX = Column(Float)
    TMIN = Column(Float)
    population = Column(Integer)
    name = Column(String, index=True,  primary_key=True)

    # class Config:
    #     orm_mode = True
