import pandas as pd
import folium

pd.set_option('display.max_columns', None)
PATH_PREFIX = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/'
ALL_WEATHER_DATA_CSV = PATH_PREFIX + 'uncleaned_data/AVERAGED_weather_station_data_ALL.csv'
map_save_location = PATH_PREFIX + 'uncleaned_data/map/'


def read_and_prepare_data():
    print("Reading weather data...")
    df_weather = pd.read_csv(
        ALL_WEATHER_DATA_CSV,
        usecols=['lat', 'long', 'name']
    )
    # Filter for stations within the latitude and longitude bounds of Italy
    df_italy = df_weather[
        (df_weather['lat'].between(35, 47)) &
        (df_weather['long'].between(6, 19))
    ]
    df_unique_italy = df_italy.drop_duplicates(subset=['lat', 'long'])
    print(df_unique_italy.head())
    return df_unique_italy


def plot_stations(df_italy):
    print("Plotting stations on map...")
    # Starting the map at a central location in Italy
    map_italy = folium.Map(location=[42.5, 12.5], zoom_start=6)
    for index, row in df_italy.iterrows():
        folium.Marker(
            [row['lat'], row['long']],
            popup=f"{row['name']}"
        ).add_to(map_italy)
    return map_italy


if __name__ == "__main__":
    df_italy = read_and_prepare_data()
    italy_map = plot_stations(df_italy)
    # Save the map as an HTML file
    italy_map.save(map_save_location + 'italy_weather_stations.html')
    print("Map has been saved!")
