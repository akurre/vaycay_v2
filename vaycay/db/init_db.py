import logging

from termcolor import cprint
import sqlalchemy
from requests import Session
from vaycay import schemas, crud
import json
from vaycay.weather_data.weather_data_json import SAMPLE_DATA
import sqlalchemy as sa
import alembic as op
from vaycay.db.utils import get_schema

logger = logging.getLogger(__name__)

FIRST_SUPERUSER = "admin@example.com"


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "vehicles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("vin", sa.String(), nullable=False),
        sa.Column("ametras_status", sa.String(), nullable=False),
        sa.Column("license_plate", sa.String(), nullable=True),
        sa.Column("engine", sa.String(), nullable=True),
        sa.Column("model", sa.String(), nullable=True),
        sa.Column("model_variant", sa.String(), nullable=True),
        sa.Column("variant", sa.String(), nullable=True),
        sa.Column("defleetion_date", sa.String(), nullable=False),
        sa.Column("defleetion_reason", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("vin"),
        schema=get_schema(),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("vehicles", schema=get_schema())
    # ### end Alembic commands ###


def init_db(db: Session) -> None:  # 1
    print('Initializing DB')

    for cities in json.loads(SAMPLE_DATA):
        initial_weather_data_in = schemas.WeatherDataBase(
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
        )
        try:
            crud.weather_data.create(db, obj_in=initial_weather_data_in)
        except sqlalchemy.exc.IntegrityError:
            cprint(f"Duplicate key value: >> Has the data already been imported?? <<", "yellow")
            print("Stopping import.")
            exit()
