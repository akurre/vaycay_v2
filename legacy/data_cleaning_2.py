import pandas as pd
import time
import geopandas as gpd
import os


# Settings
pd.set_option('display.max_columns', None)

# Constants
PATH_PREFIX = '//'
COUNTRY_FILTER = 'Italy'
POPULATION_LIMIT = 10000
BUFFER_SIZE = 0.5
ALL_WEATHER_DATA_CSV = PATH_PREFIX + 'uncleaned_data/AVERAGED_weather_station_data_ALL.csv'
WORLD_CITIES_CSV = PATH_PREFIX + 'uncleaned_data/worldcities.csv'
OUTPUT_NAME = f'datacleaning2_{POPULATION_LIMIT}population_{COUNTRY_FILTER}_{BUFFER_SIZE}buffer'
OUTPUT_CSV = PATH_PREFIX + f'vaycay/weather_data/16April2024/{OUTPUT_NAME}.csv'
JSON_OUTPUT = PATH_PREFIX + f'vaycay/weather_data/16April2024/{OUTPUT_NAME}.json'


def read_and_prepare_data():
    print("Reading weather data and reformatting date column...")
    df_weather = pd.read_csv(
        ALL_WEATHER_DATA_CSV,
        usecols=['id', 'date', 'data_type', 'lat', 'long', 'name', 'AVG']
    )
    print(df_weather.head())
    exit()
    df_weather.rename(columns={'AVG': 'value'}, inplace=True)
    df_weather['date'] = ((df_weather['date'].astype(str).str.zfill(4)) + '2020')
    df_weather['date'] = pd.to_datetime(df_weather['date'], format='%m%d%Y')

    print("Reading world city data...")
    df_cities = pd.read_csv(
        WORLD_CITIES_CSV,
        usecols=['city', 'country', 'lat', 'lng', 'population']
    )
    print("Setting country and population limits...")
    df_cities = df_cities[df_cities['population'] >= POPULATION_LIMIT]
    df_cities = df_cities[df_cities['country'] == COUNTRY_FILTER]
    df_cities.rename(columns={'lng': 'long'}, inplace=True)

    return df_weather, df_cities


def merge_datasets(df_weather, df_cities):
    print("Converting dataframes to geodataframes...")

    # Create GeoDataFrames
    gdf_cities = gpd.GeoDataFrame(df_cities, geometry=gpd.points_from_xy(df_cities.long, df_cities.lat))
    gdf_weather = gpd.GeoDataFrame(df_weather, geometry=gpd.points_from_xy(df_weather.long, df_weather.lat))

    print("Performing spatial join...")
    # Optional: Buffer the points if necessary to create an area within which to join. Adjust buffer size to your needs.
    # Here, buffer size will depend on your coordinate system, 0.1 gives 63 Italian cities, 0.3=375, 0.4=526 (but this is about 40km away)
    gdf_cities['geometry'] = gdf_cities.geometry.buffer(
        0.5)  # This buffer size is in degrees, suitable for geographic coordinate systems

    # Spatial join cities and weather data, using 'intersects' to find overlapping points
    gdf_merged = gpd.sjoin(gdf_cities, gdf_weather, how="inner", op='intersects')

    # Drop the geometry columns if no longer needed
    print(gdf_merged.head())
    gdf_merged.drop(columns=['geometry', 'lat_right', 'long_right'], inplace=True)
    gdf_merged.rename(columns={'long_left': 'long', 'lat_left': 'lat'}, inplace=True)

    return gdf_merged


def pivot_and_clean_data(df):
    print("Pivoting data...")
    df_pivot = df.pivot_table(
        index=['city', 'country', 'lat', 'long', 'population', 'date', 'name'],
        columns='data_type', values='value', aggfunc='first'
    ).reset_index()
    print(df_pivot.head())

    # Handle missing TAVG
    print("Filling in missing TAVGs...")
    df_pivot['TAVG'] = df_pivot['TAVG'].fillna(df_pivot[['TMAX', 'TMIN']].mean(axis=1))

    # make sure it's in celcius (it's celcius *10 right now)
    for column in ['TMAX', 'TAVG', 'TMIN']:
        df_pivot[column] = df_pivot[column].div(10).round(2)

    # convert time
    df_pivot['date'] = df_pivot['date'].dt.strftime('%Y-%m-%d')

    return df_pivot


def save_to_json(df):
    print("Saving to JSON...")
    os.makedirs(os.path.dirname(JSON_OUTPUT), exist_ok=True)

    df.to_json(
        JSON_OUTPUT,
        orient='records',
        force_ascii=False,
        indent=4
    )


def main():
    start_time = time.time()
    df_weather, df_cities = read_and_prepare_data()
    df_merged = merge_datasets(df_weather, df_cities)
    df_cleaned = pivot_and_clean_data(df_merged)

    unique_cities_count = df_cleaned['city'].nunique()
    print(f"Number of unique cities in the cleaned data: {unique_cities_count}")

    save_to_json(df_cleaned)

    print(f"Total time taken: {time.time() - start_time:.2f} seconds.")


if __name__ == "__main__":
    main()
