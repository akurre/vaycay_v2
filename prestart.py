import subprocess
import sys

from alembic.config import Config
from alembic import command
import logging

from app.main import ROOT


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

alembic_cfg = Config(ROOT / "alembic.ini")

subprocess.run([sys.executable, "./app/backend_pre_start.py"])
command.upgrade(alembic_cfg, "head")
subprocess.run([sys.executable, "./app/initial_data.py"])

