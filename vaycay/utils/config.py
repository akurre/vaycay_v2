import os

class Configuration:
    host = os.getenv('POSTGRES_HOST', 'localhost')
    port = os.getenv('POSTGRES_PORT', '5432')
    dbname = os.getenv('POSTGRES_DB', 'postgres')
    username = os.getenv('POSTGRES_USER', 'postgres')
    password = os.getenv('POSTGRES_PASSWORD', 'iwantsun')
    table_name = 'all_city_weather_data'
    dbschema = 'public'

    # Use DATABASE_URL from environment if available, otherwise construct from parts
    postgres_url = os.getenv('DATABASE_URL', f'postgresql://{username}:{password}@{host}:{port}/{dbname}')
