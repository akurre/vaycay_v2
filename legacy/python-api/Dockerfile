FROM python:3.12
ENV PYTHONUNBUFFERED=1
WORKDIR /vaycay

# Install system dependencies required for geopandas/fiona
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

# Set GDAL environment variables
ENV GDAL_CONFIG=/usr/bin/gdal-config

# Install Poetry
RUN pip install --upgrade pip && \
    pip install poetry

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Configure poetry to install in system python (not in virtualenv)
# This ensures packages are available even when volume is mounted 
# (takes a long time... like 600s)
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root

# Copy the rest of the application
COPY . .

# Install the project itself
RUN poetry install --no-interaction --no-ansi --only-root

EXPOSE 8000
