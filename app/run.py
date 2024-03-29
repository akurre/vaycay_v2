import uvicorn
from alembic import command, config
import traceback
from app.database import session

import logging

from app.database.init_db import init_db
from app.database.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    db = SessionLocal()
    init_db(db)


def db_initial_data_import() -> None:
    try:
        print('Inserting first data')
        init()
    except Exception as e:
        print(e)
        traceback.print_exc()


def dev() -> None:
    uvicorn.run(
        "app.main:app",
        reload=True,
        # log_config="./logging.yaml",
        host="0.0.0.0",
        port=8000,
    )


def migrate() -> None:
    try:
        cfg = config.Config("./alembic.ini")
        with session.engine.begin() as connection:
            cfg.attributes["connection"] = connection
            command.upgrade(cfg, "head")
    except Exception as e:
        print("Failed to migrate:", e)  # noqa: T201
