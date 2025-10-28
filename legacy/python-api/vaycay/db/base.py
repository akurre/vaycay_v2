# Import all the models, so that Base has them before being imported by Alembic
from vaycay.db.base_class import Base  # noqa
from vaycay.models.user import User  # noqa
from vaycay.models.weather_data import WeatherDataModel  # noqa