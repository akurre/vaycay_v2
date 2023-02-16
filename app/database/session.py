from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session


class Configuration():
    host = 'localhost'
    port = '5432'
    dbname = 'postgres'
    username = 'postgres'
    password = 'iwantsun'
    table_name = 'all_city_weather_data'
    dbschema = 'public'

    postgres_url = f'postgresql://{username}:{password}@localhost:{port}/{dbname}'


sqlalchemy_database_url = Configuration.postgres_url
engine = create_engine(sqlalchemy_database_url) 

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():       # set up connection with db
    db_session: Session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
