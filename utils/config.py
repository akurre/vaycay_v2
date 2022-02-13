class Configuration():
    host = 'localhost'
    port = '5432'
    dbname = 'date_data'
    username = 'vaycay_user'
    password = 'password123'
    table_name = 'dates_cities_population'
    dbschema = 'public'

    postgres_url = f'postgresql+psycopg2://{username}:{password}@localhost:{port}/{dbname}'