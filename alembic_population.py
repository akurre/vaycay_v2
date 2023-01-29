import sqlalchemy
from sqlalchemy import Column, String, Integer  
from sqlalchemy.ext.declarative import declarative_base
from numpy import genfromtxt
from time import time
from datetime import datetime
from sqlalchemy import Column, Integer, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


Base = sqlalchemy.orm.declarative_base()

class cities_and_weather(Base):  
    __tablename__ = 'backend_data'
    id = Column(Integer, primary_key=True)
    date = Column(Date, primary_key=True)
    data_type = Column(String, primary_key=True)
    lat = Column(String)
    long = Column(String)
    name = Column(String)
    value2016 = Column(String)
    value2017 = Column(String)
    value2018 = Column(String)
    value2019 = Column(String)
    value2020 = Column(String)
    AVG = Column(String)

if __name__ == "__main__":
    t = time()

    #Create the database
    engine = create_engine('postgresql://postgres:iwantsun@localhost:5432/postgres')
    Base.metadata.create_all(engine)

    #Create the session
    session = sessionmaker()
    session.configure(bind=engine)
    s = session()

    try:
        file_name = ".pgdata/AVERAGED_weather_station_data_ALL.csv" 
        data = load_data(file_name) 

        for i in data:
            record = cities_and_weather(**{
                'id' : i[0],
                'date' : i[1],   # datetime.strptime(i[1], '%d-%b').date(),
                'data_type' : i[2],
                'lat' : i[3],
                'long' : i[4],
                'name' : i[5],
                'value2016' : i[6],
                'value2017' : i[7],
                'value2018' : i[8],
                'value2019' : i[9],
                'value2020' : i[10],
                'AVG' : i[11]
            })
            print(record)
            s.add(record) #Add all the records

        s.commit() #Attempt to commit all the records
    except Exception as e:
        s.rollback() #Rollback the changes on error
        print('Exception!!', e)
    finally:
        s.close() #Close the connection
    print("Time elapsed: " + str(time() - t) + " s.")