# vaycay_v2

## To get things running...

### First you need to get Poetry
- `curl -sSL https://install.python-poetry.org | python3 -`
### Install dependencies
- `poetry install`
### Run the DB connection tests/data migrations
- `poetry run python app/prestart.py`
- `poetry run ./run.sh`
- Open http://localhost:8000/



 
### Loading data into PostgreSQL database via Docker

<!-- Establish project -->
docker exec -ti vaycay psql -U postgres     

<!-- connect to database -->
\c

<!-- load data from csv file into backend_data table -->
\copy backend_data (t, sth1, sth2) FROM 'data/AVERAGED_weather_station_data_ALL.csv' CSV HEADER;