from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from utils.config import Configuration as cfg

sqlalchemy_database_url = cfg.postgres_url
engine = create_engine(sqlalchemy_database_url, connect_args={'options': f'-csearch_path={cfg.dbschema}'}) #{"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base() 

def get_db():       # set up connection with db
    db = SessionLocal()
    try:
        yield db
    except:
        db.close()
