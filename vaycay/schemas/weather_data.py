from typing import Optional

from pydantic import BaseModel, HttpUrl


class WeatherDataBase(BaseModel):
    city: str
    country: str
    date: str
    lat: float
    long: float
    PRCP: Optional[float] = None
    TAVG: Optional[float] = None
    TMAX: Optional[float] = None
    TMIN: Optional[float] = None
    population: float
    name: str

    class Config:
        orm_mode = True


class CreateWeatherData(WeatherDataBase):
    label: str
    source: str
    url: HttpUrl
    submitter_id: int

    class Config:
        orm_mode = True


class UpdateWeatherData(WeatherDataBase):
    label: str
