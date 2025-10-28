import pandas as pd
import time
import json

# constants
pd.set_option('display.max_columns', None)
all_weather_data_csv = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/AVERAGED_weather_station_data_ALL.csv'
world_cities_csv = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/worldcities.csv'
country_to_filter = 'Italy'
population_limit = 10000
JSON_LIMIT_ROWS = 1000000


if __name__ == "__main__":
    # Read in weather data
    print("Reading in weather data from CSV. Please wait. ")
    start_time = time.time()
    df = pd.read_csv(
        all_weather_data_csv,
        usecols=['id', 'date', 'data_type', 'lat', 'long', 'name', 'AVG'],
        float_precision=None
    )
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # rename rows and refactor DDMM dates
    start_time = time.time()
    df = df.rename(columns={'AVG': 'avg_temp_celcius'})
    df['date'] = ((df['date'].astype(str).str.zfill(4)) + '2020')
    df['date'] = pd.to_datetime(df['date'], format='%m%d%Y')
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # Drop unneeded rows
    print('Dropping unneeded weather data rows')
    df = df[df['data_type'].isin(['TMIN', 'TMAX', 'TAVG', 'PRCP'])]

    # Delete cities with only precip
    start_time = time.time()
    print('Deleting cities with only precipitation data.')
    # Group by 'name' and filter out groups that only contain 'PRCP' in 'data_type'
    df = df.groupby('name').filter(lambda x: not (x['data_type'] == 'PRCP').all())
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # Read in city/population data
    start_time = time.time()
    print(f'Reading in population dataframe - purging cities with population < {population_limit}')
    df2 = pd.read_csv(world_cities_csv)
    df2 = df2[['city', 'country', 'lat', 'lng', 'population']]
    df2 = df2.rename(columns={'lng': 'long'})
    df2 = df2[(df2['population'] >= population_limit)]
    # Filter for country below
    if country_to_filter:
        df2 = df2[(df2['country'] == country_to_filter)]
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # merge dataframes on nearest 0.5 lat/long, inner join
    start_time = time.time()
    print('Joining dataframes')
    df2['lt'] = df2['lat'].mul(2).round().div(2)
    df2['lng'] = df2['long'].mul(2).round().div(2)
    df['lt'] = df['lat'].mul(2).round().div(2)
    df['lng'] = df['long'].mul(2).round().div(2)
    merged_df = df2.merge(df, how='inner', on=['lt', 'lng'])
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # get duplicates/same city
    start_time = time.time()
    print('Removing duplicate city entries')
    minimized = merged_df.groupby('city')
    dupes_to_delete = []
    for name, group in minimized:
        unique = group['name'].unique().tolist()
        unique.pop(0)
        if unique:
            for x in unique:
                dupes_to_delete.append(x)

    # purge duplicates
    print('Purging duplicates')
    merged_df = merged_df[~merged_df['date'].isin(dupes_to_delete)]

    # clean up duplicate columns
    df = merged_df.rename(columns={'lat_x': 'lat', 'long_x': 'long'})
    df = df.drop(columns=['lat_y', 'long_y', 'lt', 'lng', 'id'])
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # pivot tables to give temp/prcp their own columns, round temp columns
    start_time = time.time()
    print('Pivoting dataframe')
    df = df.pivot_table(index=['city', 'country', 'lat', 'long', 'population', 'date', 'name'], columns='data_type', values='avg_temp_celcius').reset_index()
    temp_cols = ['TMAX', 'TAVG', 'TMIN']
    for column in temp_cols:
        df[column] = df[column].div(10).round(2)
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # save just in case something goes wrong later
    print('Saving...this could take awhile.')
    df.to_csv(f'/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/april2024/datacleaning1-intermediate_{population_limit}population_{country_to_filter}.csv')

    # further removing stations with least data
    start_time = time.time()
    print('Removing duplicate city entries')
    minimized = df.groupby('city')
    dupes_to_delete = []
    for city, group_df in minimized:
        unique_list = group_df['name'].unique().tolist()
        if len(unique_list) > 1:
            sub_df = group_df.groupby('name')
            weather_data_nulls = {}
            for name, sub_group_df in sub_df:
                sums = sub_group_df[['PRCP', 'TAVG', 'TMAX', 'TMIN']].isna().sum().sum()
                weather_data_nulls[name] = sums
            stations_list = [*weather_data_nulls]
            minimum_nulls_station = min(weather_data_nulls, key=weather_data_nulls.get)
            stations_list.remove(minimum_nulls_station)
            for station in stations_list:
                dupes_to_delete.append(station)

    # purge duplicates
    print('Cleaning up')
    df = df[~df['name'].isin(dupes_to_delete)]
    df = df.loc[:, ~df.columns.str.match('Unnamed')]
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # fill in averages if TAVG is not available, but TMAX and TMIN are available
    print('Filling in TAVG if not available')
    df['TAVG'] = df['TAVG'].fillna(df[['TMAX', 'TMIN']].mean(axis=1))

    # save csv
    print('Saving...this could take awhile.')
    df.to_csv(
        f'/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/april2024/datacleaning1-fin_{population_limit/1000}k_population_{country_to_filter}.csv',
        index=False)

    # transform csv to json
    print('transforming csv to json')
    # file_name = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/minimized_weather_population_station_data_cleaned_10k_population_Italy.csv'
    # df = pd.read_csv(file_name, nrows=JSON_LIMIT_ROWS)
    # print(df)
    df['date'] = df['date'].dt.strftime('%Y-%m-%d')

    df.to_json(
        f'/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/april2024/datacleaning1-fin_{population_limit/1000}k_population_{country_to_filter}.json',
        orient='records',
        force_ascii=False,
        indent=4
    )

