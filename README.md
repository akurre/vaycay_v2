# vaycay_v2

## To get things running...

### First you need to get Poetry
- `curl -sSL https://install.python-poetry.org | python3 -`
### Set up environment with PyCharm
- Go to interpreter settings
- Choose new Poetry environment
- Select pyenv python 3.12
  - dir should look something like `/Users/.../.pyenv/versions/3.12.1/bin/python`
- `poetry install` should be automatically run, but if not...
### Install dependencies
- `poetry install`
### Start PostgreSQL Docker container
- `make docker`
### Run the DB connection tests/data migrations
- `make prestart`
- `make start-deps`
- Open http://localhost:8000/


## Troubleshooting

Sometimes, you might get an error with the FastAPI encoders.
Replace the following:
`        
try:
    data = vars(obj)`
with
`
try:
    data = dict(obj._asdict())
`

[//]: # ( )
[//]: # (### Loading data into PostgreSQL database via Docker)

[//]: # ()
[//]: # (<!-- Establish project -->)

[//]: # (docker exec -ti vaycay psql -U postgres     )

[//]: # ()
[//]: # (<!-- connect to database -->)

[//]: # (\c)

[//]: # ()
[//]: # (<!-- load data from csv file into backend_data table -->)

[//]: # (\copy backend_data &#40;t, sth1, sth2&#41; FROM 'data/AVERAGED_weather_station_data_ALL.csv' CSV HEADER;)