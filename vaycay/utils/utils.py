import pandas as pd
import sqlalchemy
from sqlalchemy import inspect
import psycopg2
from psycopg2 import sql
import logging


host = 'localhost'
port = 5432
dbname = 'date_data'
username = 'vaycay_user'
password = 'password123'
engine = sqlalchemy.create_engine(f'postgresql://{username}:{password}@{host}:{port}/{dbname}')


def access_from_pickle(select_date, index_name, pickle_path='/Users/ashlenkurre/Documents/GitHub/vaycay/other/data/cleaned_data/combined_noyear_3indexed_2019.pkl'):
    df = pd.read_pickle(pickle_path)
    data_needed = df.iloc[df.index.get_level_values(index_name) == select_date]
    return data_needed

def fetch_schemas():
    inspector = inspect(engine)
    schemas = inspector.get_schema_names()

    for schema in schemas:
        print("schema: %s" % schema)
        for table_name in inspector.get_table_names(schema=schema):
            for column in inspector.get_columns(table_name, schema=schema):
                print("Column: %s" % column)

def import_to_db(pickle_path, table_name):
    print('reading')
    pickle = pd.read_csv(pickle_path)
    print('pickle read')
    pickle.to_sql(name=table_name, con=engine, if_exists='replace', schema=None)
    print('done')


def createDB(dbName, drop_db=False):
    connString=f'postgresql://{username}:{password}@{host}:{port}/{dbname}'
    conn = psycopg2.connect(connString)
    conn.set_session(autocommit =True) # autocommit must be True sein, else CREATE DATABASE will fail https://www.psycopg.org/docs/usage.html#transactions-control
    cursor = conn.cursor()
    if drop_db:
        dropDB = sql.SQL('DROP DATABASE {} WITH (FORCE);').format(sql.Identifier(dbName))
        try:
            cursor.execute(dropDB)
        except Exception as e:
            print('drop DB failed')
            logging.error(e)
            conn.close()
            exit()
    else:
        createDB = sql.SQL('CREATE DATABASE IF NOT EXISTS {};').format(sql.Identifier(dbName))
        try:
            cursor.execute(createDB)
        except Exception as e:
            print('create DB failed')
            logging.error(e)
            conn.close()
            exit()


def create_schema(schema_name, db_name):
    connString=f'postgresql://{username}:{password}@{host}:{port}/{db_name}'
    conn = psycopg2.connect(connString)
    conn.set_session(autocommit =True) # autocommit must be True sein, else CREATE DATABASE will fail https://www.psycopg.org/docs/usage.html#transactions-control
    cursor = conn.cursor()
    createSchema = sql.SQL(f'CREATE SCHEMA IF NOT EXISTS {schema_name};')
    searchpath = sql.SQL('ALTER DATABASE {} SET search_path TO public, schema2;').format(sql.Identifier(db_name))
    try:
        cursor.execute(createSchema)
        print('schema created')
    except Exception as e:
        print('create schema failed')
        logging.error(e)
        conn.close()
        exit()
    try:
        cursor.execute(searchpath)
    except Exception as e:
        print('set searchpath failed')
        logging.error(e)
        conn.close()
        exit()
    conn.close()


def create_table():
    connString=f'postgresql://{username}:{password}@{host}:{port}/{dbname}'
    conn = psycopg2.connect(connString)
    conn.set_session(autocommit =True) # autocommit must be True sein, else CREATE DATABASE will fail https://www.psycopg.org/docs/usage.html#transactions-control
    cursor = conn.cursor()
    command = """
        DROP TABLE IF EXISTS dates_cities_population;
        CREATE TABLE dates_cities_population AS 
        SELECT  
            D.id
            ,D.name
            ,D.lat
            ,D.long
            ,D.date
            ,CAST((CASE WHEN D.prcp = 'NA' then null ELSE D.prcp END) as DOUBLE PRECISION) as prcp
            ,CAST((CASE WHEN D.snow = 'NA' then null ELSE D.snow END) as DOUBLE PRECISION) as snow
            ,CAST((CASE WHEN D.tavg = 'NA' then null ELSE D.tavg END) as DOUBLE PRECISION) as tavg
            ,CAST((CASE WHEN D.tmax = 'NA' then null ELSE D.tmax END) as DOUBLE PRECISION) as tmax
            ,CAST((CASE WHEN D.tmin = 'NA' then null ELSE D.tmin END) as DOUBLE PRECISION) as tmin
            ,P.population as Population
			,P.country as Country
        FROM 
            all_dates_2019 as D 
            INNER JOIN cities_population as P on        UPPER(D.name) = UPPER(P.city)
                                                    AND ROUND(D.lat) = ROUND(P.lat)
													
		WHERE 
			 ( 
			D.tavg != 'NA' OR
			D.tmax != 'NA' OR
			D.tmin != 'NA'
			)
    """
    command2 = """
    UPDATE dates_cities_population
    SET snow = NULL
    WHERE UPPER(snow) LIKE '%NA%'"""
    createDB = sql.SQL(command)
    try:
        cursor.execute(createDB)
    except Exception as e:
        print('create DB failed')
        logging.error(e)
        conn.close()
        exit()


if __name__ == "__main__":
    # createDB(dbName='test', drop_db=True)
    # import_to_db(pickle_path='/Users/ashlenkurre/Documents/GitHub/vaycay_safe/other/data/cleaned_data/worldcities.csv', table_name='cities_population')
    create_table()
    # pass