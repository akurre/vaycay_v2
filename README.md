# vaycay_v2

**Vaycay v2** is a FastAPI-based REST API that provides historical average weather data for locations worldwide. The system enables users to query weather statistics for specific dates or cities, helping with vacation planning based on historical weather patterns.

## 🎯 Project Goal

The end result of this project is to provide access to historical average weather data for any given location and day of the year. Users can query weather metrics including temperature (average, min, max) and precipitation for cities around the world.

## 🏗️ Technology Stack

- **Backend Framework**: FastAPI 0.89.1
- **Database**: PostgreSQL (containerized with Docker)
- **ORM**: SQLAlchemy 2.0+
- **Database Migrations**: Alembic
- **Web Server**: Uvicorn
- **Language**: Python 3.12+
- **Dependency Management**: Poetry
- **Data Processing**: Pandas, GeoPandas, Folium
- **Geolocation**: Geopy
- **Containerization**: Docker & Docker Compose

## 📊 Data Structure

### Weather Data Model

Each weather record contains:

- **Location Information**:
  - `city`: City name
  - `country`: Country name
  - `state`: State/region
  - `suburb`: Suburb/district
  - `lat`: Latitude coordinate
  - `long`: Longitude coordinate
  - `name`: Weather station name

- **Weather Metrics**:
  - `PRCP`: Precipitation (mm)
  - `TAVG`: Average temperature (°C)
  - `TMAX`: Maximum temperature (°C)
  - `TMIN`: Minimum temperature (°C)

- **Temporal Data**:
  - `date`: Date in format `YYYY-MM-DD` (e.g., `2020-03-15`)

### Database Schema

The application uses a PostgreSQL database with a single main table (`weather_data`) that stores all weather records. The table uses a composite primary key consisting of `city`, `date`, and `name` (weather station).

## 🚀 API Endpoints

The API provides the following endpoints:

### 1. Root Endpoint
```
GET /
```
Health check endpoint that returns a simple greeting.

**Response Example**:
```json
{
  "request": {"host": "127.0.0.1", "port": 12345},
  "return": "hello world!"
}
```

### 2. Get All Records (Limited)
```
GET /get_all
```
Returns the first 10 weather records from the database.

**Response**: Array of weather data objects

### 3. Get Weather by Date
```
GET /day/{month_and_day}
```
Retrieves all weather records for a specific day of the year across all locations.

**Parameters**:
- `month_and_day`: Date in format `MMDD` (e.g., `0315` for March 15th)

**Example Request**:
```
GET /day/0315
```

**Response**: Array of weather data objects for March 15th from all available locations

### 4. Get Weather by City
```
GET /city/{city_selected}
```
Retrieves all weather records for a specific city across all dates.

**Parameters**:
- `city_selected`: City name (case-insensitive, will be title-cased)

**Example Request**:
```
GET /city/Rome
```

**Response**: Array of weather data objects for the specified city

### API Documentation

Interactive API documentation is available via Swagger UI:
- **URL**: http://localhost:8000/docs
- **Date Format**: `YYYY-MM-DD` (e.g., `2020-03-15`)

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.12+**: Required for running the application
- **Poetry**: Python dependency management tool
- **Docker & Docker Compose**: For running PostgreSQL database
- **Make**: For using the provided Makefile commands (optional but recommended)

## 🛠️ Installation & Setup

### 1. Install Poetry

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

### 2. Set up Environment with PyCharm (Optional)

- Go to interpreter settings
- Choose new Poetry environment
- Select pyenv python 3.12
  - Directory should look something like `/Users/.../.pyenv/versions/3.12.1/bin/python`
- `poetry install` should be automatically run, but if not, proceed to step 3

### 3. Install Dependencies

```bash
poetry install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory with your database configuration:

```env
DATABASE_URL=postgresql://postgres:iwantsun@localhost:5432/postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=iwantsun
```

### 5. Start PostgreSQL Docker Container

```bash
make docker
```

This will start a PostgreSQL container on port 5432.

### 6. Run Database Migrations

```bash
make prestart
```

This runs Alembic migrations to set up the database schema.

### 7. Import Initial Weather Data

```bash
make data
```

This imports the historical weather data from the JSON file into the database.

**⚠️ Important Note**: The data file path is currently hardcoded in `vaycay/utils/const.py`:
```python
DATA_TO_LOAD = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/16April2024/datacleaning4_nopopulation_wholeEurope.json'
```

You may need to update this path to match your local setup if the data import fails.

### 8. Start the Development Server

```bash
make start-deps
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs

## 🔧 Development Workflow

The project includes a Makefile with helpful commands:

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make install` | Install dependencies via Poetry |
| `make docker` | Start PostgreSQL container |
| `make prestart` | Run Alembic migrations |
| `make start-deps` | Start the development server |
| `make data` | Import initial weather data |
| `make test` | Run unit tests |
| `make test-int` | Run integration tests |
| `make migrations-create m="message"` | Create new Alembic migration |
| `make migrations-run` | Run pending migrations |
| `make lint` | Run flake8 and mypy |
| `make format` | Format code with black and isort |

## 📁 Project Structure

```
vaycay_v2/
├── vaycay/                          # Main application package
│   ├── main.py                      # FastAPI application and routes
│   ├── crud/                        # CRUD operations
│   │   ├── base.py                  # Base CRUD class with query methods
│   │   └── crud_weather_data.py     # Weather data CRUD operations
│   ├── db/                          # Database configuration
│   │   ├── session.py               # Database session management
│   │   ├── init_db.py               # Database initialization
│   │   └── base_class.py            # SQLAlchemy base class
│   ├── models/                      # SQLAlchemy models
│   │   └── weather_data.py          # Weather data model
│   ├── schemas/                     # Pydantic schemas
│   │   └── weather_data.py          # Weather data schemas
│   ├── utils/                       # Utility functions
│   │   ├── const.py                 # Constants (data file paths)
│   │   └── config.py                # Configuration settings
│   └── weather_data/                # Weather data files
│       └── 16April2024/             # Data snapshot from April 2024
│           └── datacleaning4_nopopulation_wholeEurope.json
├── alembic/                         # Database migrations
├── tests/                           # Test files
├── docker-compose.yml               # Docker services configuration
├── Dockerfile                       # Application container definition
├── pyproject.toml                   # Poetry dependencies
├── Makefile                         # Development commands
└── README.md                        # This file
```

## 🗄️ Data Source & Coverage

The application uses pre-processed historical weather data stored in:
```
vaycay/weather_data/16April2024/datacleaning4_nopopulation_wholeEurope.json
```

This dataset contains weather records for cities worldwide. The data has been cleaned and processed to provide consistent historical averages.

**Note**: The current test dataset may contain a limited geographic subset of the full global data. The filename references "wholeEurope" but the system is designed to support worldwide locations.

**⚠️ Missing Data Files**: If you encounter errors about missing data files during setup, ensure that:
1. The data file exists at the path specified in `vaycay/utils/const.py`
2. The path is correctly configured for your local environment
3. You have the necessary permissions to read the file

## 🐛 Troubleshooting

### FastAPI Encoder Error

Sometimes, you might get an error with the FastAPI encoders. If you encounter this issue:

**Replace the following:**
```python
try:
    data = vars(obj)
```

**With:**
```python
try:
    data = dict(obj._asdict())
```

### Database Connection Issues

If you can't connect to the database:
1. Ensure Docker is running: `docker ps`
2. Check if PostgreSQL container is up: `docker-compose ps`
3. Verify environment variables in `.env.local`
4. Restart the database: `docker-compose down && docker-compose up`

### Data Import Fails

If the data import fails with "Duplicate key value" error:
- The data has already been imported
- To re-import, you need to drop and recreate the database tables

### Port Already in Use

If port 8000 or 5432 is already in use:
- Change the port in `docker-compose.yml` (for PostgreSQL)
- Change the port in `vaycay/main.py` or when running uvicorn (for the API)

## 🔐 Database Configuration

The application uses PostgreSQL with the following default configuration:

- **Host**: localhost
- **Port**: 5432
- **Database**: postgres
- **User**: postgres
- **Password**: iwantsun (configurable in docker-compose.yml)

## 📝 Notes

- The date format in the database is `YYYY-MM-DD` (e.g., `2020-03-15`)
- The API endpoint for dates uses `MMDD` format (e.g., `0315`)
- City names are automatically title-cased when querying
- Weather data is historical and represents averages, not real-time data
- The system is designed to support worldwide locations (current dataset may vary)
- Some weather metrics (PRCP, TAVG, TMAX, TMIN) may be `null` for certain records if data was unavailable

## 🚧 Future Enhancements

Potential improvements for the project:
- Add filtering by date range
- Implement pagination for large result sets
- Add more sophisticated querying (e.g., by temperature range, precipitation levels)
- Expand the dataset to include more global locations
- Add data visualization endpoints
- Implement caching for frequently accessed data
- Add authentication and rate limiting

## 📄 License

This project is licensed under "n" (as specified in pyproject.toml).

## 👤 Author

Ashlen Kurre
