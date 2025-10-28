# Legacy Python FastAPI Backend

This directory contains the original Python FastAPI backend (built basically at the beginning of my career) that has been replaced by the TypeScript GraphQL API.

## Archive Date
October 27, 2025

## Reason for Archival
The Python FastAPI backend has been fully replaced by a modern TypeScript GraphQL API using:
- **GraphQL**: Apollo Server with Nexus (code-first schema)
- **ORM**: Prisma (replacing SQLAlchemy)
- **Language**: TypeScript (replacing Python)
- **Database**: PostgreSQL (unchanged)

## What's Archived

### Python API (`python-api/`)
- **vaycay/**: Complete FastAPI application
  - Models (SQLAlchemy)
  - CRUD operations
  - Pydantic schemas
  - Database configuration
  - City and weather data files
- **alembic/**: Database migrations
- **tests/**: Python API tests
- **Configuration**: pyproject.toml, poetry.lock, alembic.ini
- **Docker**: Dockerfile and Makefile

### Data Scripts (`data-scripts/`)
- Data cleaning and processing scripts
- Plot generation utilities
- These were used for initial data preparation

### Data Files (`data/`)
- Old weather data directory
- Historical data files

## Running the Legacy API (If Needed)

If you need to run the old Python API for reference:

```bash
cd legacy/python-api

# Install dependencies
poetry install

# Run migrations
poetry run alembic upgrade head

# Start server
poetry run uvicorn vaycay.main:app --reload --host 0.0.0.0 --port 8000
```

## Migration Documentation

See the main project's `MIGRATION_PLAN.md` for complete migration details.

## New Architecture

The current production system uses:
- **GraphQL API**: `server/` directory (TypeScript)
- **Frontend**: `client/` directory (React + Apollo Client)
- **Database**: PostgreSQL with Prisma ORM

For current development, see the main `README.md` in the project root.
