# TODO Change all this....
import logging

from requests import Session
from app import crud, schemas
from database import base  # noqa: F401
from app.weather_data.weather_data_json import DATA

logger = logging.getLogger(__name__)

FIRST_SUPERUSER = "admin@example.com"


def init_db(db: Session) -> None:  # 1
    if FIRST_SUPERUSER:
        user = crud.user.get_by_email(db, email=FIRST_SUPERUSER)  # 2
        if not user:
            user_in = schemas.UserCreate(
                full_name="Initial Super User",
                email=FIRST_SUPERUSER,
                is_superuser=True,
            )
            user = crud.user.create(db, obj_in=user_in)
        else:
            logger.warning(
                "Skipping creating superuser. User with email "
                f"{FIRST_SUPERUSER} already exists. "
            )
        if not user.weather_data:
            for cities in DATA:
                user_submitted_weather_data_in = schemas.WeatherDataBase(
                    city=cities["city"],
                    country=cities["country"],
                    lat=cities["lat"],
                    long=cities["long"],
                    population=cities["population"],
                    date=cities["date"],
                    name=cities["name"],
                    PRCP=cities["PRCP"],
                    TAVG=cities["TAVG"],
                    TMAX=cities["TMAX"],
                    TMIN=cities["TMIN"],
                    submitter_id=user.id,
                )
                crud.weather_data.create(db, obj_in=user_submitted_weather_data_in)
