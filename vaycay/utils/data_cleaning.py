from heapq import merge
import numpy as np
import pandas as pd
from sqlalchemy import Column, Integer, Float, String, Date, null
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
import json


# Base = declarative_base()

# class cities_and_weather(Base):
#     __tablename__ = 'all_city_weather_data'
#     city = Column(String, primary_key=True, nullable=True)
#     country = Column(String, nullable=True)
#     date = Column(Date, primary_key=True, nullable=True)
#     data_type = Column(String, primary_key=True, nullable=True)
#     lat = Column(Float, nullable=True)
#     long = Column(Float, nullable=True)
#     population = Column(Float, nullable=True)
#     name = Column(String, nullable=True)
#     avg_temp_celcius = Column(Float, nullable=True)
#
#     class Config:
#         orm_mode = True


if __name__ == "__main__":
    # engine = create_engine('postgresql://postgres:iwantsun@localhost:5432/postgres')
    # Base.metadata.create_all(engine)

    # Read in weather data
    print("Reading in weather data from CSV - DB engine created. Please wait. ")
    file_name = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/AVERAGED_weather_station_data_ALL.csv'
    df = pd.read_csv(file_name, usecols = ['id','date', 'data_type', 'lat', 'long', 'name', 'AVG'], float_precision=None)
    df = df.rename(columns={'AVG': 'avg_temp_celcius'})
    df['date'] = ((df['date'].astype(str).str.zfill(4)) + '2020')
    df['date'] = pd.to_datetime(df['date'], format='%m%d%Y')

    # Drop unneeded rows 
    df = df[df['data_type'].isin(['TMIN', 'TMAX', 'TAVG', 'PRCP'])]

    # # Delete cities with only precip
    # grouped = df.groupby('name')
    # for name, group in grouped:
    #     unique = df['data_type'].unique()
    #     if 'T' not in ''.join(unique):
    #         df.drop(grouped.get_group(name).index)
    #         print("PRCP dropped!")

    # Read in city/population data
    pop_limit = 10000
    print(f'Reading in population dataframe - purging cities with population < {pop_limit}')
    file_name = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/worldcities.csv'
    df2 = pd.read_csv(file_name)
    df2 = df2[['city', 'country', 'lat', 'lng', 'population']]
    df2 = df2.rename(columns={'lng': 'long'})
    # Filter for Italy only below
    df2 = df2[df2['country'] == 'Italy']
    pop = df2['population'].unique().tolist()
    df2.drop(df2[df2.population < pop_limit].index, inplace=True)
    
    # merge dataframes on nearest 0.5 lat/long, inner join
    print('Joining dataframes')
    df2['lt'] = df2['lat'].mul(2).round().div(2)
    df2['lng'] = df2['long'].mul(2).round().div(2)
    df['lt'] = df['lat'].mul(2).round().div(2)
    df['lng'] = df['long'].mul(2).round().div(2)
    merged_df = df2.merge(df, how = 'inner', on = ['lt', 'lng'])

    # get duplicates/same city
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
    print('Cleaning up')
    merged_df = merged_df[~merged_df['date'].isin(dupes_to_delete)]

    # clean up dupe columns
    df = merged_df.rename(columns={'lat_x': 'lat', 'long_x': 'long'})
    df = df.drop(columns=['lat_y', 'long_y', 'lt', 'lng', 'id'])

    # pivot tables to give temp/prcp their own columns, round temp columns
    print('Pivoting dataframe')
    df = df.pivot_table(index=['city', 'country', 'lat', 'long', 'population', 'date', 'name'], columns='data_type', values='avg_temp_celcius').reset_index()
    temp_cols = ['TMAX', 'TAVG', 'TMIN']
    for column in temp_cols:
        df[column] = df[column].div(10).round(2)

    # save
    print('Saving...this could take awhile.')
    df.to_csv('/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/vaycay/weather_data/minimized_weather_population_station_data_cleaned_10k_population_Italy.csv')


