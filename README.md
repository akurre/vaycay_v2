# vaycay_v2

**Vaycay v2** is a weather data API platform providing historical average weather data for locations worldwide. The system is currently migrating from a Python FastAPI REST API to a modern TypeScript GraphQL API, enabling users to query weather statistics for specific dates or cities to help with vacation planning based on historical weather patterns.

## 🎯 Project Goal

The end result of this project is to provide access to historical average weather data for any given location and day of the year. Users can query weather metrics including temperature (average, min, max), precipitation, and snow depth for cities around the world.

## 🏗️ Technology Stack

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **GraphQL Client**: Apollo Client 4
- **Routing**: React Router 6
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI
- **Map Visualization**: React Leaflet
- **Port**: 3000

### GraphQL API (Current - Recommended)
- **API Framework**: Apollo Server 4
- **Schema**: Nexus (code-first GraphQL)
- **Database ORM**: Prisma
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 20+
- **Port**: 4001

### Legacy Python REST API (Archived)
The original Python FastAPI backend has been archived to the `legacy/` directory. See the [Legacy Code](#-legacy-code) section below for details.

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

## 🎨 React Frontend

### Quick Start

1. **Install Dependencies**:
```bash
cd client
npm install
```

2. **Configure Environment**:
The frontend uses environment variables to connect to the GraphQL API. Two environment files are already configured:

- `client/.env.development` - For local development (points to localhost:4001)
- `client/.env.production` - For Docker/production (points to graphql-api:4001)

3. **Start the Development Server**:
```bash
cd client
npm start
```

The frontend will be available at:
- **Application**: http://localhost:3000
- **Default Route**: http://localhost:3000/day/03-15 (March 15th weather map)

### Features

- **Interactive Weather Map**: Visualize weather data on a world map using Leaflet
- **Date Selection**: Choose any date to see historical weather patterns
- **City Markers**: Click on city markers to view detailed weather information
- **GraphQL Integration**: Real-time data fetching with Apollo Client caching
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/day/:date` | Weather map for a specific date (format: `MM-DD`, e.g., `/day/03-15`) |

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run dev` | Alias for `npm start` |
| `npm run build` | Build production bundle |
| `npm test` | Run tests |

### Docker Deployment

The frontend can be run in Docker:

```bash
docker-compose up frontend
```

This will:
- Build the React app with production optimizations
- Serve it via Nginx on port 3000
- Connect to the GraphQL API at `graphql-api:4001`

#### Why Nginx?

The production Docker build uses **nginx** as a lightweight, high-performance web server to serve the static React build files. Nginx provides:

- **Efficient Static File Serving**: Much faster than running a Node.js development server
- **Client-Side Routing Support**: Configured with `try_files $uri $uri/ /index.html` to ensure React Router works correctly - all routes are redirected to `index.html` so the React app can handle routing
- **Production-Ready**: Industry-standard solution for serving single-page applications
- **Small Footprint**: The nginx Alpine image is minimal and optimized for containers

The multi-stage Dockerfile builds the React app with Node.js, then copies the static build output to an nginx container, keeping the final image small and secure.

### Architecture

The frontend uses Apollo Client to communicate with the GraphQL API:

```typescript
// Apollo Client configuration
const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});
```

### Frontend Structure

The client follows a standard React project structure organized by feature:

```
client/src/
├── pages/              # Route components (home, date)
├── components/         # Reusable components
│   ├── Map/           # Map visualization (WorldMap, MapPopup)
│   ├── Navigation/    # Navigation components (dateNavigaton)
│   ├── Weather/       # Weather-specific components (future)
│   └── Shared/        # Shared UI components (future)
├── api/               # GraphQL integration
│   ├── apolloClient.ts
│   ├── queries.ts
│   └── dates/         # Date-specific hooks (useWeatherByDate)
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks (future)
├── stores/            # State management (future)
├── utils/             # Utility functions (future)
└── contexts/          # React Context providers (future)
```

**Key Technologies:**
- **Styling**: Tailwind CSS (utility-first, no traditional CSS files)
- **TypeScript**: Full type safety with path aliases configured
- **React Router**: Client-side routing
- **Apollo Client**: GraphQL data fetching with caching
- **React Leaflet**: Interactive map visualization

**Key Components:**
- `client/src/pages/date.tsx` - Main weather map page
- `client/src/components/Map/WorldMap.tsx` - Leaflet map component
- `client/src/components/Map/MapPopup.tsx` - Weather data popup
- `client/src/components/Navigation/dateNavigaton.tsx` - Date selection form
- `client/src/api/dates/useWeatherByDate.ts` - GraphQL hook for fetching weather data

### GraphQL Integration

The frontend uses custom hooks to fetch data:

```typescript
// Fetch weather data for a specific date
const { dataReturned, isLoading, isError } = useWeatherByDate('0315');
```

This hook:
- Queries the GraphQL API using Apollo Client
- Handles date format normalization (converts `03-15` to `0303`)
- Provides loading and error states
- Converts GraphQL data to legacy format for backward compatibility

---

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

- **Node.js 20+**: Required for running the GraphQL API and React frontend
- **npm**: Node package manager (comes with Node.js)
- **Docker & Docker Compose**: For running PostgreSQL database and containerized services

## 🛠️ Installation & Setup

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire stack:

```bash
# Start all services (database, GraphQL API, frontend)
docker-compose up

# Or run in detached mode
docker-compose up -d
```

This will start:
- **PostgreSQL**: localhost:5431
- **GraphQL API**: localhost:4001
- **React Frontend**: localhost:3000

### Option 2: Local Development

#### 1. Start PostgreSQL Database

```bash
docker-compose up db
```

#### 2. Set Up GraphQL API

```bash
cd server
npm install
npx prisma migrate dev
npm run import-data
npm run dev
```

The GraphQL API will be available at http://localhost:4001

#### 3. Set Up React Frontend

```bash
cd client
npm install
npm start
```

The frontend will be available at http://localhost:3000

### Importing Data

The GraphQL server includes a data import script:

```bash
cd server
npm run import-data
```

This imports the Italy dataset (214,054 records). The data is sourced from the legacy Python application's processed weather data files.

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
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   ├── components/              # Reusable components
│   │   ├── api/                     # GraphQL queries and hooks
│   │   └── types/                   # TypeScript type definitions
│   ├── Dockerfile                   # Frontend container
│   ├── package.json                 # Node.js dependencies
│   └── tsconfig.json                # TypeScript configuration
├── legacy/                          # Archived Python code
│   ├── python-api/                  # Original FastAPI application
│   │   ├── vaycay/                  # Main application code
│   │   ├── alembic/                 # Database migrations
│   │   ├── tests/                   # Python tests
│   │   └── pyproject.toml           # Poetry dependencies
│   ├── data-scripts/                # Data processing scripts
│   └── README.md                    # Legacy documentation
├── uncleaned_data/                  # Raw data files
├── docker-compose.yml               # Docker services configuration
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

## 🗂️ Legacy Code

The original Python FastAPI backend has been archived to the `legacy/` directory as of October 27, 2025.

**Migration Reason**: The project has been migrated to a modern TypeScript GraphQL stack for:
- Better type safety across the entire stack
- Modern development practices
- Improved developer experience
- Easier frontend integration with Apollo Client

**What's Archived**:
- Complete Python FastAPI application (`legacy/python-api/vaycay/`)
- Alembic database migrations (`legacy/python-api/alembic/`)
- Python tests and configuration files
- Data cleaning and processing scripts (`legacy/data-scripts/`)

**Running the Legacy API**:
If you need to run the old Python API for reference, see `legacy/README.md` for instructions.

**Migration Documentation**:
For complete migration details, see `MIGRATION_PLAN.md`.

## 🐛 Troubleshooting

### Database Connection Issues

If you can't connect to the database:
1. Ensure Docker is running: `docker ps`
2. Check if PostgreSQL container is up: `docker-compose ps`
3. Verify the database is healthy: `docker-compose logs db`
4. Restart the database: `docker-compose down && docker-compose up db`

### GraphQL Server Issues

If the GraphQL server won't start:
1. Check if port 4001 is available: `lsof -i :4001`
2. Verify Prisma client is generated: `cd server && npx prisma generate`
3. Check database connection in `server/.env`
4. View server logs: `docker-compose logs graphql-api`

### Frontend Issues

If the React frontend won't start:
1. Check if port 3000 is available: `lsof -i :3000`
2. Verify environment variables in `client/.env.development`
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
4. Check that GraphQL API is running at http://localhost:4001

### Data Import Fails

If the data import fails:
- Check that the data file exists in the legacy directory
- Verify database connection
- Check for duplicate key errors (data may already be imported)
- View import logs for specific error messages

### Port Already in Use

If ports are already in use:
- **PostgreSQL (5431)**: Change in `docker-compose.yml` under `db.ports`
- **GraphQL API (4001)**: Change in `docker-compose.yml` under `graphql-api.ports` and `server/.env`
- **Frontend (3000)**: Change in `docker-compose.yml` under `frontend.ports`

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

## � Author

Ashlen Kurre
