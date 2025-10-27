# vaycay_v2

**Vaycay v2** is a weather data API platform providing historical average weather data for locations worldwide. The system is currently migrating from a Python FastAPI REST API to a modern TypeScript GraphQL API, enabling users to query weather statistics for specific dates or cities to help with vacation planning based on historical weather patterns.

## 🎯 Project Goal

The end result of this project is to provide access to historical average weather data for any given location and day of the year. Users can query weather metrics including temperature (average, min, max), precipitation, and snow depth for cities around the world.

## 🏗️ Technology Stack

### GraphQL API (Current - Recommended)
- **API Framework**: Apollo Server 4
- **Schema**: Nexus (code-first GraphQL)
- **Database ORM**: Prisma
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 20+
- **Port**: 4001

### Python REST API (Legacy - Being Phased Out)
- **Backend Framework**: FastAPI 0.89.1
- **ORM**: SQLAlchemy 2.0+
- **Database Migrations**: Alembic
- **Web Server**: Uvicorn
- **Language**: Python 3.12+
- **Dependency Management**: Poetry
- **Port**: 8000

### Shared Infrastructure
- **Database**: PostgreSQL (containerized with Docker)
- **Containerization**: Docker & Docker Compose
- **Data Processing**: Pandas, GeoPandas, Folium, Geopy

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

## 🚀 GraphQL API (Recommended)

### Quick Start

1. **Install Dependencies**:
```bash
cd server
npm install
```

2. **Configure Environment**:
Create `server/.env`:
```env
DATABASE_URL=postgresql://postgres:iwantsun@localhost:5431/postgres
PORT=4001
NODE_ENV=development
```

3. **Run Prisma Migrations**:
```bash
cd server
npx prisma migrate dev
```

4. **Import Weather Data**:
```bash
cd server
npm run import-data
```

This imports the Italy dataset (214,054 records). For the global dataset:
```bash
npm run import-data -- --file=vaycay/weather_data/global_weather_data_cleaned.json
```

5. **Start the GraphQL Server**:
```bash
cd server
npm run dev
```

The GraphQL API will be available at:
- **GraphQL Endpoint**: http://localhost:4001/
- **GraphQL Playground**: http://localhost:4001/

### Available Queries

#### 1. Get Weather Data (Paginated)
Retrieve a paginated list of weather records with all available fields:

```graphql
query GetWeatherData {
  weatherData(limit: 10, offset: 0) {
    city
    country
    state
    suburb
    date
    lat
    long
    population
    avgTemperature
    maxTemperature
    minTemperature
    precipitation
    snowDepth
    stationName
    submitterId
  }
}
```

**Example Response:**
```json
{
  "data": {
    "weatherData": [
      {
        "city": "Abbiategrasso",
        "country": "Italy",
        "state": null,
        "suburb": null,
        "date": "2020-01-04",
        "lat": 45.4009,
        "long": 8.9185,
        "population": 32737,
        "avgTemperature": 2.48,
        "maxTemperature": 6.73,
        "minTemperature": null,
        "precipitation": null,
        "snowDepth": null,
        "stationName": "CAMERI",
        "submitterId": null
      }
    ]
  }
}
```

#### 2. Get Weather by Date
Find weather conditions across all cities for a specific day (e.g., March 15th for vacation planning):

```graphql
query GetSpringWeather {
  weatherByDate(monthDay: "0315") {
    city
    country
    avgTemperature
    maxTemperature
    minTemperature
    precipitation
    population
  }
}
```

**Use Case:** Planning a spring vacation? Check historical weather for March 15th across all available cities.

#### 3. Get Weather by City
Retrieve all weather records for a specific city throughout the year:

```graphql
query GetRomeWeather {
  weatherByCity(city: "Rome") {
    date
    avgTemperature
    maxTemperature
    minTemperature
    precipitation
    snowDepth
    stationName
  }
}
```

**Use Case:** See Rome's weather patterns throughout the year to pick the best time to visit.

#### 4. Find Warm Winter Destinations
Combine queries to find cities with pleasant winter weather:

```graphql
query WarmWinterDestinations {
  weatherByDate(monthDay: "0115") {
    city
    country
    avgTemperature
    maxTemperature
    minTemperature
    population
  }
}
```

**Tip:** Filter results where `avgTemperature > 15` to find warm destinations in January.

#### 5. Get All Cities
List all available cities in the database:

```graphql
query GetAllCities {
  cities
}
```

**Example Response:**
```json
{
  "data": {
    "cities": [
      "Abbiategrasso",
      "Acerra",
      "Acireale",
      "Adrano",
      "Afragola",
      "..."
    ]
  }
}
```

#### 6. Get All Countries
List all available countries:

```graphql
query GetAllCountries {
  countries
}
```

#### 7. Compare Cities for Vacation Planning
Get weather data for multiple cities on the same date:

```graphql
query CompareCities {
  rome: weatherByCity(city: "Rome") {
    date
    avgTemperature
    precipitation
  }
  milan: weatherByCity(city: "Milan") {
    date
    avgTemperature
    precipitation
  }
  florence: weatherByCity(city: "Florence") {
    date
    avgTemperature
    precipitation
  }
}
```

**Use Case:** Compare weather patterns between Rome, Milan, and Florence to choose your destination.

#### 8. Find Cities with Specific Weather Conditions
Get summer weather data to find hot destinations:

```graphql
query HotSummerDestinations {
  weatherByDate(monthDay: "0715") {
    city
    country
    avgTemperature
    maxTemperature
    precipitation
    population
  }
}
```

**Tip:** Look for cities where `maxTemperature > 30` for hot summer destinations, or `precipitation < 5` for dry weather.

#### 9. Minimal Query for Quick Checks
Get just the essential information:

```graphql
query QuickWeatherCheck {
  weatherByCity(city: "Venice") {
    date
    avgTemperature
    precipitation
  }
}
```

#### 10. Detailed City Analysis
Get comprehensive weather data for in-depth analysis:

```graphql
query DetailedCityAnalysis {
  weatherByCity(city: "Naples") {
    date
    avgTemperature
    maxTemperature
    minTemperature
    precipitation
    snowDepth
    stationName
    lat
    long
    population
  }
}
```

**Use Case:** Analyze Naples' complete weather patterns including temperature ranges, precipitation, and even snow depth for winter months.

### GraphQL Schema

The GraphQL API provides a `WeatherData` type with the following fields:

```graphql
type WeatherData {
  city: String!
  country: String
  state: String
  suburb: String
  date: String!
  lat: Float
  long: Float
  population: Float
  precipitation: Float
  snowDepth: Float
  avgTemperature: Float
  maxTemperature: Float
  minTemperature: Float
  stationName: String!
  submitterId: String
}
```

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run generate` | Generate GraphQL schema |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run import-data` | Import weather data from JSON |

### Docker Deployment

The GraphQL server can be run in Docker alongside the Python API:

```bash
docker-compose up graphql-api
```

Or run all services:
```bash
docker-compose up
```

Services:
- **PostgreSQL**: localhost:5431
- **Python API**: localhost:8000
- **GraphQL API**: localhost:4001

## 🚀 REST API Endpoints (Legacy)

The Python REST API provides the following endpoints:

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

alternatively

```bash
docker compose build --no-cache
```

This will start a PostgreSQL container on port 5431. I used 5431 because I often use 5432 as the port for my work's repo, and I like to keep it running.

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
├── server/                          # GraphQL API (TypeScript)
│   ├── src/
│   │   ├── index.ts                 # Apollo Server entry point
│   │   ├── schema.ts                # Nexus schema generation
│   │   ├── context.ts               # GraphQL context (Prisma client)
│   │   └── graphql/
│   │       ├── index.ts             # Export all GraphQL types
│   │       ├── enums.ts             # GraphQL enums
│   │       └── WeatherData.ts       # Weather data queries & types
│   ├── prisma/
│   │   └── schema.prisma            # Prisma database schema
│   ├── scripts/
│   │   └── import-data.ts           # Data import utility
│   ├── Dockerfile                   # GraphQL server container
│   ├── package.json                 # Node.js dependencies
│   └── tsconfig.json                # TypeScript configuration
├── vaycay/                          # Python REST API (Legacy)
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
│           └── cleaned_weather-data_10000population_Italy.json
├── alembic/                         # Database migrations (Python)
├── tests/                           # Test files
├── docker-compose.yml               # Docker services configuration
├── Dockerfile                       # Python API container definition
├── pyproject.toml                   # Poetry dependencies
├── Makefile                         # Development commands
├── MIGRATION_PLAN.md                # Migration roadmap
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
