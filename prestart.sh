#! /usr/bin/env bash

# Let the DB start
echo "Starting DB"
python ./app/backend_pre_start.py

# Run migrations
echo "Running Migrations"
alembic upgrade head

# Create initial data in DB
echo "Creating initial data"
python ./app/initial_data.py