class Configuration():
    host = 'localhost'
    port = '5432'
    dbname = 'vaycay'
    username = 'postgres'
    password = 'iwantsun'
    table_name = 'all_city_weather_data'
    dbschema = 'public'

    postgres_url = f'postgresql://{username}:{password}@localhost:{port}/{dbname}'