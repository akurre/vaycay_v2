from vaycay.crud.base import CRUDBase
from vaycay.models.weather_data import WeatherDataModel
from vaycay.schemas.weather_data import WeatherDataBase, CreateWeatherData, UpdateWeatherData


# The class is defined with the relevant SQLAlchemy WeatherDataBase model
class CRUDWeatherData(CRUDBase[WeatherDataBase, CreateWeatherData, UpdateWeatherData]):
    pass


# We instantiate the CRUDWeatherData class
weather_data = CRUDWeatherData(WeatherDataModel)  # 2
