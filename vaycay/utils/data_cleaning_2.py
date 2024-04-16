import json
import pandas as pd
import geopandas as gpd
import time

if __name__ == "__main__":
    pd.set_option('display.max_columns', None)
    start_time = time.time()

    weather_file = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/AVERAGED_weather_station_data_ALL.csv'
    city_file = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/worldcities.csv'
    population_filter = 10000
    json_rows_limit = 100000

    # Read in weather data  (past time taken: 22.48 seconds)
    print("Reading in weather data from CSV. Please wait.")
    df = pd.read_csv(weather_file, nrows=10000)
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # Rename and reformat columns (past time taken: 21.13 seconds)
    start_time = time.time()
    print('Renaming and reformatting columns to datetime.')
    df.rename(columns={'AVG': 'avg_temp_celcius'}, inplace=True)
    df['date'] = pd.to_datetime(df['date'].astype(str).str.zfill(4) + '2020', format='%m%d%Y')
    df = df[df['data_type'].isin(['TMIN', 'TMAX', 'TAVG', 'PRCP'])]
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # Filter out weather stations with only precipitation data (past time taken: 12.17 seconds)
    start_time = time.time()
    print('Filtering out weather stations with only precipitation data.')
    grouped = df.groupby('name')
    for name, group in grouped:
        if 'T' not in group['data_type'].unique():
            df.drop(group.index, inplace=True)
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # Read in city data, focusing on Italian cities with a significant population (past time taken: 0.06 seconds)
    print(f'Reading in population dataframe - purging cities with population < {population_filter}')
    world_cities_csv = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/worldcities.csv'
    df2 = pd.read_csv(world_cities_csv)
    df2 = df2[['city', 'country', 'lat', 'lng', 'population']]
    df2 = df2.rename(columns={'lng': 'long'})
    # Filter for country below
    country = 'Italy'
    df2 = df2[(df2['country'] == country) & (df2['population'] >= population_filter)]

    # Convert dataframes to GeoDataFrames (past time taken: 3.10 seconds)
    start_time = time.time()
    print('Convert dataframes to GeoDataFrames.')
    gdf_stations = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.long, df.lat))
    gdf_cities = gpd.GeoDataFrame(df2, geometry=gpd.points_from_xy(df2.long, df2.lat))
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')
    print(df.head())
    print(df2.head())
    exit()

    # Spatial join - find the nearest weather station for each city (past time taken: 73 minutes with 10k pop)
    start_time = time.time()
    print('Finding the nearest weather station for each city.')
    nearest_station_ids = []
    for index, city in gdf_cities.iterrows(): # Iterate over each row in the cities GeoDataFrame
        # Find the nearest weather station's index
        nearest_station_id = gdf_stations.distance(city.geometry).idxmin()
        nearest_station_ids.append(nearest_station_id)
        if index % 10 == 0:
            print(f"Record {index}: Processing {city['city']} - Nearest Station ID: {nearest_station_id}")
    # Assign the list of nearest station IDs back to the DataFrame
    df2['nearest_station_id'] = nearest_station_ids
    merged_df = df2.join(gdf_stations.loc[df2['nearest_station_id']].set_index(df2.index), rsuffix='_station')
    print(f'Time taken: {time.time() - start_time:.2f} seconds')

    # save in case of issues
    print('Saving intermediate step...')
    output_file_int = f'/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/INTERMEDIATE_{population_filter / 1000}k_population_Italy_aigen.csv'
    # merged_df.to_csv(output_file_int, index=False)
    # print(merged_df.head())


    # read in csv again in case of exit
    merged_df = pd.read_csv(output_file_int)
    sample_df = merged_df.loc[merged_df['city'] == 'Abbiategrasso']
    print(sample_df.head(10))

    # Pivot table for clean organization (past time taken:  seconds)
    start_time = time.time()
    print('Pivoting table.')
    final_df = merged_df.pivot_table(index=['city', 'country', 'lat', 'long', 'population', 'date'],
                                     columns='data_type', values='avg_temp_celcius').reset_index()
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')
    print(final_df.head(10))
    exit()

    # Calculate average temperature if TAVG is missing (past time taken:  seconds)
    start_time = time.time()
    print('Calculating missing TAVG.')
    final_df['TAVG'] = final_df.apply(
        lambda row: (row['TMAX'] + row['TMIN']) / 2 if pd.isna(row['TAVG']) else row['TAVG'], axis=1)
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')

    # Convert temperatures to Celsius and round them (past time taken:  seconds)
    start_time = time.time()
    print('Converting to Celsius and rounding.')
    temp_cols = ['TMAX', 'TAVG', 'TMIN']
    for column in temp_cols:
        final_df[column] = final_df[column].div(10).round(2)
    print(f'Time taken: {time.time() - start_time:.2f} seconds. \n\n')
    print(final_df.head(60))


    # Save the cleaned data (past time taken:  seconds)
    output_file = f'/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/minimized_weather_population_station_data_cleaned_{population_filter/1000}k_population_Italy_aigen.csv'
    start_time = time.time()
    print(f'Saving csv...this could take awhile.')
    final_df.to_csv(output_file, index=False)
    print(f"Data saved successfully! \n Time taken: {time.time() - start_time:.2f} seconds. \n\n")
    exit()

    # Transform csv to json (past time taken:  seconds)
    start_time = time.time()
    print(f'Transforming csv to json (.py) with limit of {json_rows_limit} rows.')
    df = pd.read_csv(output_file, nrows=json_rows_limit)
    data = df.to_json(orient="records", force_ascii=False, indent=4)
    with open(f'{output_file[:-4]}.py', 'w') as f:
        json.dump(data, f)
    print(f'JSON file saved successfully! \n Time taken: {time.time() - start_time:.2f} seconds. \n\n')
