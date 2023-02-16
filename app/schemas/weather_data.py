from typing import Optional

from pydantic import BaseModel, HttpUrl


class WeatherDataBase(BaseModel):
    city: str
    country: str
    date: str
    lat: float
    long: float
    precipitation: Optional[float] = None
    avg_temp: Optional[float] = None
    max_temp: Optional[float] = None
    min_temp: Optional[float] = None
    population: float
    name: str

class CreateWeatherData(WeatherDataBase):
    label: str
    source: str
    url: HttpUrl
    submitter_id: int

class UpdateWeatherData(WeatherDataBase):
    label: str
