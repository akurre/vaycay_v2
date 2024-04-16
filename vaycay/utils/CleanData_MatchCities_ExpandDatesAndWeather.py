import pandas as pd
import time
import os
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# Settings
pd.set_option('display.max_columns', None)
limit_region = False

# Constants
PATH_PREFIX = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/'
COUNTRY_FILTER = 'Italy'
POPULATION_LIMIT = 'none'
ALL_WEATHER_DATA_CSV = PATH_PREFIX + 'uncleaned_data/AVERAGED_weather_station_data_ALL.csv'
OUTPUT_CSV = PATH_PREFIX + f'vaycay/weather_data/16April2024/datacleaning4_{POPULATION_LIMIT}population_{COUNTRY_FILTER}.csv'
JSON_OUTPUT = PATH_PREFIX + f'vaycay/weather_data/16April2024/datacleaning4_{POPULATION_LIMIT}population_{COUNTRY_FILTER}.json'
lat_long_filter = {   # italy: lat: 35-47, long: 6-19
    'min_lat': 44,
    'max_lat': 47,
    'min_long': 16,
    'max_long': 19
}
lat_range = f'lat{lat_long_filter["min_lat"]}-{lat_long_filter["max_lat"]}'
long_range = f'long{lat_long_filter["min_long"]}-{lat_long_filter["max_long"]}'
if limit_region:
    CITY_SPEC_OUTPUT_FILENAME = f'{lat_range}_{long_range}_location_specific_data.csv'
else:
    CITY_SPEC_OUTPUT_FILENAME = f'ALL_location_specific_data.csv'
CITY_SPEC_OUTPUT_FILENAME_2 = f'ALL_location_specific_data_simplified.csv'
CITY_SPEC_OUTPUT = PATH_PREFIX + 'vaycay/city_data/' + CITY_SPEC_OUTPUT_FILENAME
CITY_SPEC_OUTPUT_2 = PATH_PREFIX + 'vaycay/city_data/' + CITY_SPEC_OUTPUT_FILENAME_2


def read_and_prepare_data():
    print("Reading weather data and reformatting date column...")
    df_weather = pd.read_csv(
        ALL_WEATHER_DATA_CSV,
        usecols=['id', 'date', 'data_type', 'lat', 'long', 'name', 'AVG']
    )
    if limit_region:
        df_weather = df_weather[(df_weather['lat'].between(
            lat_long_filter['min_lat'], lat_long_filter['max_lat'])) & (df_weather['long'].between(lat_long_filter['min_long'], lat_long_filter['max_long']))]
    df_weather.rename(columns={'AVG': 'value'}, inplace=True)
    df_weather['date'] = ((df_weather['date'].astype(str).str.zfill(4)) + '2020')
    df_weather['date'] = pd.to_datetime(df_weather['date'], format='%m%d%Y')
    return df_weather


def get_unique_locations(df_weather):
    print("Getting unique locations from original dataframe...")
    unique_locs = df_weather[['lat', 'long']].drop_duplicates().reset_index(drop=True)
    print(len(unique_locs))
    exit()
    return unique_locs


def reverse_geocode_locations(unique_locs):
    print("Starting the reverse geo-coding...")
    geolocator = Nominatim(user_agent="geoapi_exercises")
    reverse = RateLimiter(geolocator.reverse, min_delay_seconds=1)

    # Reverse geocode each unique location
    unique_locs['location'] = unique_locs.apply(lambda row: reverse((row['lat'], row['long']), language='en'), axis=1)
    os.makedirs(os.path.dirname(CITY_SPEC_OUTPUT), exist_ok=True)
    unique_locs.to_csv(CITY_SPEC_OUTPUT_2)

    # Extract city or fallback to village if city is not available
    print("Extracting the data from the reverse geocode results...")
    unique_locs['city'] = unique_locs['location'].apply(
        lambda loc: loc.raw['address'].get('city',
                                           loc.raw['address'].get('village',
                                                                  loc.raw['address'].get('town', '') if loc else ''))
        if loc else ''
    )

    # Extract state or fallback to county if state is not available
    unique_locs['state'] = unique_locs['location'].apply(
        lambda loc: loc.raw['address'].get('state', loc.raw['address'].get('county', '') if loc else ''))

    # Continue with other location details as previously
    unique_locs['country'] = unique_locs['location'].apply(
        lambda loc: loc.raw['address'].get('country', '') if loc else '')

    unique_locs['suburb'] = unique_locs['location'].apply(
        lambda loc: loc.raw['address'].get('suburb', loc.raw['address'].get('municipality', '') if loc else ''))

    # Remove the location object to clean up the DataFrame
    unique_locs.drop(columns='location', inplace=True)

    # save
    print("Saving city-specific csv...")
    os.makedirs(os.path.dirname(CITY_SPEC_OUTPUT), exist_ok=True)
    unique_locs.to_csv(CITY_SPEC_OUTPUT)
    return unique_locs


def merge_with_original(df_weather, unique_locs):
    print("Merging location df with original...")
    df_enriched = pd.merge(df_weather, unique_locs, on=['lat', 'long'], how='left')
    return df_enriched


def pivot_and_clean_data(df):
    print("Pivoting data...")
    df_pivot = df.pivot_table(
        index=['city', 'country', 'state', 'suburb', 'lat', 'long', 'date', 'name'],
        columns='data_type', values='value', aggfunc='first'
    ).reset_index()
    print("Processing weather data and date values...")
    df_pivot['TAVG'] = df_pivot['TAVG'].fillna(df_pivot[['TMAX', 'TMIN']].mean(axis=1))
    df_pivot['TMAX'] = df_pivot['TMAX'].div(10).round(2)
    df_pivot['TMIN'] = df_pivot['TMIN'].div(10).round(2)
    df_pivot['TAVG'] = df_pivot['TAVG'].div(10).round(2)
    df_pivot['date'] = df_pivot['date'].dt.strftime('%Y-%m-%d')
    return df_pivot


def save_to_json(df):
    print("Saving to JSON...")
    os.makedirs(os.path.dirname(JSON_OUTPUT), exist_ok=True)
    df.to_json(JSON_OUTPUT, orient='records', force_ascii=False, indent=4)


def main():
    start_time = time.time()
    df_weather = read_and_prepare_data()
    unique_locs = get_unique_locations(df_weather)
    geocoded_data = reverse_geocode_locations(unique_locs)
    df_filled = merge_with_original(df_weather, geocoded_data)
    df_cleaned = pivot_and_clean_data(df_filled)
    save_to_json(df_cleaned)
    print(f"Total time taken: {time.time() - start_time:.2f} seconds.")


if __name__ == "__main__":
    main()
