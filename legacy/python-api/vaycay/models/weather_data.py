from sqlalchemy import Column, Date, Float, Integer, String
from vaycay.utils.config import Configuration as cfg
from vaycay.db.base_class import Base


class WeatherDataModel(Base):
    __tablename__ = cfg.table_name
    city = Column(String, nullable=False, primary_key=True)
    country = Column(String)
    state = Column(String)
    suburb = Column(String)
    date = Column(String, index=True, nullable=False, primary_key=True)
    lat = Column(String)
    long = Column(String)
    PRCP = Column(Float)
    TAVG = Column(Float)
    TMAX = Column(Float)
    TMIN = Column(Float)
    name = Column(String, index=True,  primary_key=True)
    submitter_id = Column(String)

    class Config:
        orm_mode = True
