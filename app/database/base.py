# Import all the models, so that Base has them before being imported by Alembic
from app.database.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.weather_data import WeatherDataModel  # noqa