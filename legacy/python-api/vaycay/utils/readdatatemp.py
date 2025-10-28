import pandas as pd

filename = '/Users/ashlenlaurakurre/Documents/GitHub/vaycay_v2/uncleaned_data/AVERAGED_weather_station_data_ALL.csv'

# Load the data (removing the limit of 50 rows)
train = pd.read_csv(filename)

num_rows = len(train)
# Print the number of rows
print(f"Number of rows: {num_rows}")

# Get all unique names in the 'name' column
unique_names = train['name'].unique()



# Print the unique names
print("Unique station names:")
print(unique_names)

# Optional: print the number of unique names as well
print(f"Number of unique station names: {len(unique_names)}")