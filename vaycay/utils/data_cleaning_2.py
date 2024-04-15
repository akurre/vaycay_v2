from heapq import merge
import numpy as np
import pandas as pd
from sqlalchemy import Column, Integer, Float, String, Date, null
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
import json


if __name__ == "__main__":
    # isolate cities and countries covered
    file_name = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/minimized_weather_population_station_data_cleaned_10k_population_Italy.csv'
    df = pd.read_csv(file_name)

    # # create json file of countries covered
    # df_min = df[['city', 'country']]
    # df_grp = df_min.groupby('country')
    # cities_dict = {}
    # for country, cities in df_grp:
    #     print('COUNTRY: ', country, '\n CITIES: ', cities['city'].unique())
    #     cities_dict[country] = cities['city'].unique().tolist()
    # with open('data/cities_countries_covered_population_30k.json', 'w') as fp:
    #     json.dump(cities_dict, fp)


    # further removing stations with least data
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

    # fill in averages if not available
    df['TAVG'] = df['TAVG'].fillna(df[['TMAX', 'TMIN']].mean(axis=1))
    print(df)

    # save
    print('Saving...this could take awhile.')
    df.to_csv(
        '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/minimized_weather_population_station_data_cleaned_10k_population_Italy.csv',
        index=False)

    '''
    # migrate to PostgreSQL
    file_name = 'data/minimized_weather_population_station_data_cleaned_10k_population.csv'
    df = pd.read_csv(file_name)
    print("Transformations of dataframe complete. Now importing into PostgreSQL db. Preview of data: \n", df.head(15))
    df.to_sql(con=engine, index_label='index', name=cities_and_weather.__tablename__, if_exists='replace')
    print("Migration to PostgreSQL DB complete. ")
    '''

    # transform csv to json
    print('transforming csv to json')
    file_name = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/minimized_weather_population_station_data_cleaned_10k_population_Italy.csv'
    df = pd.read_csv(file_name, nrows=100000)
    # print(df)
    data = df.to_json(orient="records", force_ascii=False, indent=4)
    with open('../weather_data/minimized_weather_population_station_data_cleaned_10k_population_Italy.py', 'w') as f:
        json.dump(data, f)
    # print(data)
