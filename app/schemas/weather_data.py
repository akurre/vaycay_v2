from pydantic import BaseModel, HttpUrl


class WeatherDataBase(BaseModel):
    city: str
    country: str
    date: str
    lat: float
    long: float
    precipitation: float
    avg_temp: float
    max_temp: float
    min_temp: float
    population: float
    name: str

class CreateWeatherData(WeatherDataBase):
    label: str
    source: str
    url: HttpUrl
    submitter_id: int

class UpdateWeatherData(WeatherDataBase):
    label: str
