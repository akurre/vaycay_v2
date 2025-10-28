# vaycay_v2

**Vaycay v2** is a weather data API platform providing historical average weather data for locations worldwide. The system uses a modern TypeScript GraphQL API with a React frontend, enabling users to query weather statistics for specific dates or cities to help with vacation planning based on historical weather patterns.

## 🎯 Project Goal

Provide access to historical average weather data for any given location and day of the year. Users can query weather metrics including temperature (average, min, max), precipitation, and snow depth for cities around the world.

## 🏗️ Technology Stack

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **GraphQL Client**: Apollo Client 4
- **Routing**: React Router 6
- **Styling**: Tailwind CSS
- **Map Visualization**: React Leaflet
- **Port**: 3000

### Backend (GraphQL API)
- **API Framework**: Apollo Server 4
- **Schema**: Nexus (code-first GraphQL)
- **Database ORM**: Prisma
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 20+
- **Port**: 4001

### Infrastructure
- **Database**: PostgreSQL (containerized with Docker)
- **Containerization**: Docker & Docker Compose

## 📊 Data Structure

### Weather Data Model

Each weather record contains:

- **Location Information**: city, country, state, suburb, lat, long, weather station name
- **Weather Metrics**: precipitation (mm), average/max/min temperature (°C), snow depth (mm)
- **Temporal Data**: date in format `YYYY-MM-DD` (e.g., `2020-03-15`)

### Database Schema

The application uses a PostgreSQL database with a single main table (`weather_data`) that stores all weather records. The table uses a composite primary key consisting of `city`, `date`, and `name` (weather station).

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

**For detailed backend documentation, see [server/README.md](server/README.md)**

#### 3. Set Up React Frontend

```bash
cd client
npm install
npm start
```

The frontend will be available at http://localhost:3000

**For detailed frontend documentation, see [client/README.md](client/README.md)**

## 📁 Project Structure

```
vaycay_v2/
├── server/                          # GraphQL API (TypeScript)
│   ├── src/                         # Source code
│   ├── prisma/                      # Database schema & migrations
│   ├── scripts/                     # Utility scripts (data import)
│   └── README.md                    # Backend documentation
├── client/                          # React Frontend
│   ├── src/                         # Source code
│   ├── public/                      # Static assets
│   └── README.md                    # Frontend documentation
├── legacy/                          # Archived Python code
│   ├── python-api/                  # Original FastAPI application
│   └── README.md                    # Legacy documentation
├── uncleaned_data/                  # Raw data files
├── docker-compose.yml               # Docker services configuration
├── MIGRATION_PLAN.md                # Migration roadmap
└── README.md                        # This file
```

## 🚀 Quick Start Guide

### Using the Application

1. **Start the services**:
   ```bash
   docker-compose up
   ```

2. **Access the frontend**:
   - Open http://localhost:3000
   - Navigate to http://localhost:3000/day/03-15 to see weather data for March 15th

3. **Query the GraphQL API**:
   - Open http://localhost:4001 for GraphQL Playground
   - Try example queries (see [server/README.md](server/README.md) for details)

### Example GraphQL Query

```graphql
query GetSpringWeather {
  weatherByDate(monthDay: "0315") {
    city
    country
    avgTemperature
    maxTemperature
    precipitation
  }
}
```

## 🗄️ Data Source & Coverage

The application uses pre-processed historical weather data. The current dataset contains weather records for cities worldwide, with a focus on European locations.

**Data Import:**
```bash
cd server
npm run import-data
```

This imports the Italy dataset (214,054 records) from the legacy Python application's processed weather data files.

## 🐛 Troubleshooting

### Database Connection Issues

If you can't connect to the database:
1. Ensure Docker is running: `docker ps`
2. Check if PostgreSQL container is up: `docker-compose ps`
3. Restart the database: `docker-compose down && docker-compose up db`

### GraphQL Server Issues

If the GraphQL server won't start:
1. Check if port 4001 is available: `lsof -i :4001`
2. Verify Prisma client is generated: `cd server && npx prisma generate`
3. View server logs: `docker-compose logs graphql-api`

### Frontend Issues

If the React frontend won't start:
1. Check if port 3000 is available: `lsof -i :3000`
2. Verify GraphQL API is running at http://localhost:4001
3. Check environment variables in `client/.env.development`

### Port Already in Use

If ports are already in use, you can change them in `docker-compose.yml`:
- **PostgreSQL (5431)**: Under `db.ports`
- **GraphQL API (4001)**: Under `graphql-api.ports` and `server/.env`
- **Frontend (3000)**: Under `frontend.ports`

## 🗂️ Legacy Code

The original Python FastAPI backend has been archived to the `legacy/` directory as of October 27, 2025.

**Migration Reason**: The project has been migrated to a modern TypeScript GraphQL stack for better type safety, modern development practices, and improved developer experience.

**Running the Legacy API**: If you need to run the old Python API for reference, see `legacy/README.md` for instructions.

**Migration Documentation**: For complete migration details, see `MIGRATION_PLAN.md`.

## 📚 Documentation

- **Backend/GraphQL API**: [server/README.md](server/README.md)
- **Frontend/React**: [client/README.md](client/README.md)
- **Legacy Python API**: [legacy/README.md](legacy/README.md)
- **Migration Plan**: [MIGRATION_PLAN.md](MIGRATION_PLAN.md)

## 🔐 Database Configuration

The application uses PostgreSQL with the following default configuration:

- **Host**: localhost
- **Port**: 5431 (mapped from container's 5432)
- **Database**: postgres
- **User**: postgres
- **Password**: iwantsun (configurable in docker-compose.yml)

## 📝 Notes

- The date format in the database is `YYYY-MM-DD` (e.g., `2020-03-15`)
- The API endpoint for dates uses `MMDD` format (e.g., `0315`)
- Weather data is historical and represents averages, not real-time data
- Some weather metrics may be `null` for certain records if data was unavailable

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
