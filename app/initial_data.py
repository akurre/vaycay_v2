import logging

from database.init_db import init_db
from database.session import SessionLocal
import schemas
import crud
from weather_data.weather_data_json import DATA

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    db = SessionLocal()
    init_db(db, schemas=schemas, crud=crud, DATA=DATA)


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
