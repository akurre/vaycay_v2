from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.utils.config import Configuration as Cfg


sqlalchemy_database_url = Cfg.postgres_url
engine = create_engine(sqlalchemy_database_url) 

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():      # set up connection with db
    db_session: Session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
