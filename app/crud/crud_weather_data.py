from app.crud.base import CRUDBase
from app.models.weather_data import weather_data_model
from app.schemas.weather_data import WeatherDataBase


# The class is defined with the relevant SQLAlchemy WeatherDataBase model
class CRUDWeatherData(CRUDBase[WeatherDataBase]):  
    ...

# We instantiate the CRUDWeatherData class
recipe = CRUDWeatherData(WeatherDataBase)  # 2