# Tutorial

pip install fastapi fastapi-sqlalchemy pydantic alembic psycopg2 uvicorn python-dotenv

docker-compose run app alembic revision --autogenerate -m "New Migration"
docker-compose run app alembic upgrade head

docker-compose build
docker-compose up









<!--
To create and configure postgres docker containers:
 docker run --name vaycay -p 5432:5432 -e POSTGRES_PASSWORD=iwantsun -d postgres 
 run docker ps to see status-->



 import pickle as pkl
import pandas as pd
with open("/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/data/AVERAGED_weather_station_data_ALL.pkl", "rb") as f:
    object = pkl.load(f)
    
df = pd.DataFrame(object)
df.to_csv(r'/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/data/AVERAGED_weather_station_data_ALL_tab.csv', sep='\t')