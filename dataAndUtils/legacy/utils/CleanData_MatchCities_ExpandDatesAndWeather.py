"""
Script to process weather station data and match it to nearest cities.

INPUT FORMAT:
    CSV file with columns: id, date, data_type, lat, long, name, AVG
    Example:
        id,date,data_type,lat,long,name,AVG
        AE000041196,101,TMIN,25.333,55.517,SHARJAH INTER.,147.6
        AE000041196,101,TAVG,25.333,55.517,SHARJAH INTER.,208.2
    
    Where:
        - id: Weather station ID
        - date: Date as MMDD (e.g., 101 = January 1st)
        - data_type: TMIN, TMAX, TAVG, PRCP, etc.
        - lat/long: Station coordinates (decimal degrees)
        - name: Station name
        - AVG: Average value across years (temperatures in tenths of degrees C)

OUTPUT FORMAT:
    CSV/JSON with columns: city, country, state, suburb, lat, long, date, name, 
                          TMAX, TMIN, TAVG, PRCP (if available)
    Example:
        city,country,state,suburb,lat,long,date,name,TMAX,TMIN,TAVG,PRCP
        Sharjah,United Arab Emirates,Sharjah,,25.333,55.517,2020-01-01,SHARJAH INTER.,29.3,15.5,20.8,0.0
    
    Where:
        - city/country/state/suburb: Geocoded location information
        - lat/long: Rounded to 3 decimal places
        - date: ISO format (YYYY-MM-DD)
        - Temperatures: Converted to degrees Celsius (from tenths)
        - PRCP: Precipitation in mm (from tenths)

INTERMEDIATE FILES:
    - vaycay/city_data/geocoding_checkpoint.csv: Incremental geocoding progress
    - vaycay/city_data/geocoding_progress.json: Progress metadata
    - vaycay/city_data/ALL_location_specific_data.csv: Final geocoded locations
    - vaycay/city_data/failed_geocodes.json: Locations that failed geocoding
    - weather_processing.log: Detailed processing log

This script:
1. Reads historical weather data tied to weather stations
2. Reverse geocodes station coordinates to find nearest cities
3. Expands dates and processes weather values
4. Saves intermediate results to prevent data loss

Improvements:
- Removed all country/region filters for global coverage
- Incremental saving with checkpoint/resume capability
- Progress tracking and better error handling
- Configurable paths and batch processing
- Memory-efficient processing for large datasets
- Command-line arguments for flexibility
- Data validation and quality checks
"""

import pandas as pd
import time
import sys
import argparse
from pathlib import Path
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
from datetime import datetime
import json
import logging
from typing import Optional

# Settings
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('weather_processing.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Constants - Make these configurable
PROJECT_ROOT = Path(__file__).parent.parent.parent
UNCLEANED_DATA_DIR = PROJECT_ROOT / 'uncleaned_data'
OUTPUT_DIR = PROJECT_ROOT / 'vaycay' / 'weather_data'
CITY_DATA_DIR = PROJECT_ROOT / 'vaycay' / 'city_data'

# Default processing settings
DEFAULT_BATCH_SIZE = 100  # Save checkpoint every N locations
DEFAULT_GEOCODING_DELAY = 1.5  # Seconds between geocoding requests (Nominatim limit)


def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description='Process global weather station data and match to cities',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run with defaults
  python CleanData_MatchCities_ExpandDatesAndWeather.py
  
  # Resume from checkpoint only (skip if complete)
  python CleanData_MatchCities_ExpandDatesAndWeather.py --resume-only
  
  # Use custom batch size
  python CleanData_MatchCities_ExpandDatesAndWeather.py --batch-size 200
  
  # Skip geocoding (use existing data)
  python CleanData_MatchCities_ExpandDatesAndWeather.py --skip-geocoding
  
  # Validate data quality
  python CleanData_MatchCities_ExpandDatesAndWeather.py --validate
        """
    )
    
    parser.add_argument(
        '--input-csv',
        type=str,
        default=str(UNCLEANED_DATA_DIR / 'AVERAGED_weather_station_data_ALL.csv'),
        help='Path to input weather data CSV'
    )
    
    parser.add_argument(
        '--output-dir',
        type=str,
        default=str(OUTPUT_DIR),
        help='Directory for output files'
    )
    
    parser.add_argument(
        '--batch-size',
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help='Number of locations to geocode before saving checkpoint'
    )
    
    parser.add_argument(
        '--geocoding-delay',
        type=float,
        default=DEFAULT_GEOCODING_DELAY,
        help='Delay in seconds between geocoding requests'
    )
    
    parser.add_argument(
        '--skip-geocoding',
        action='store_true',
        help='Skip geocoding step and use existing checkpoint data'
    )
    
    parser.add_argument(
        '--resume-only',
        action='store_true',
        help='Only resume incomplete geocoding, exit if complete'
    )
    
    parser.add_argument(
        '--validate',
        action='store_true',
        help='Run data validation checks'
    )
    
    parser.add_argument(
        '--no-json',
        action='store_true',
        help='Skip JSON output (only save CSV)'
    )
    
    return parser.parse_args()


def ensure_directories():
    """Create necessary directories if they don't exist."""
    for directory in [OUTPUT_DIR, CITY_DATA_DIR]:
        directory.mkdir(parents=True, exist_ok=True)


def read_and_prepare_data(input_csv: str) -> pd.DataFrame:
    """
    Read weather data and reformat date column with validation.
    
    Args:
        input_csv: Path to input CSV file
    
    Returns:
        DataFrame with weather data
    """
    logger.info("Reading weather data and reformatting date column...")
    logger.info(f"Reading from: {input_csv}")
    
    input_path = Path(input_csv)
    if not input_path.exists():
        raise FileNotFoundError(f"Weather data file not found: {input_csv}")
    
    # Check file size
    file_size_mb = input_path.stat().st_size / (1024 * 1024)
    logger.info(f"Input file size: {file_size_mb:.1f} MB")
    
    # Read the data with dtype optimization
    dtype_dict = {
        'id': 'str',
        'date': 'int32',
        'data_type': 'category',
        'lat': 'float32',
        'long': 'float32',
        'name': 'str',
        'AVG': 'float32'
    }
    
    df_weather = pd.read_csv(
        input_csv,
        usecols=['id', 'date', 'data_type', 'lat', 'long', 'name', 'AVG'],
        dtype=dtype_dict
    )
    
    logger.info(f"Loaded {len(df_weather):,} weather records")
    
    # Data validation
    null_counts = df_weather.isnull().sum()
    if null_counts.any():
        logger.warning(f"Null values found:\n{null_counts[null_counts > 0]}")
    
    # Rename and format
    df_weather.rename(columns={'AVG': 'value'}, inplace=True)
    df_weather['date'] = ((df_weather['date'].astype(str).str.zfill(4)) + '2020')
    df_weather['date'] = pd.to_datetime(df_weather['date'], format='%m%d%Y', errors='coerce')
    
    # Check for invalid dates
    invalid_dates = df_weather['date'].isnull().sum()
    if invalid_dates > 0:
        logger.warning(f"Found {invalid_dates:,} invalid dates, dropping these rows")
        df_weather = df_weather.dropna(subset=['date'])
    
    return df_weather


def get_unique_locations(df_weather: pd.DataFrame) -> pd.DataFrame:
    """Extract unique weather station locations with validation."""
    logger.info("Getting unique locations from weather data...")
    
    # Remove invalid coordinates
    valid_coords = (
        (df_weather['lat'].between(-90, 90)) &
        (df_weather['long'].between(-180, 180))
    )
    invalid_count = (~valid_coords).sum()
    if invalid_count > 0:
        logger.warning(f"Removing {invalid_count:,} records with invalid coordinates")
        df_weather = df_weather[valid_coords]
    
    unique_locs = df_weather[['lat', 'long']].drop_duplicates().reset_index(drop=True)
    logger.info(f"Found {len(unique_locs):,} unique weather station locations")
    
    # Round coordinates to reduce near-duplicate locations
    unique_locs['lat'] = unique_locs['lat'].round(3)
    unique_locs['long'] = unique_locs['long'].round(3)
    unique_locs = unique_locs.drop_duplicates().reset_index(drop=True)
    logger.info(f"After rounding to 3 decimals: {len(unique_locs):,} unique locations")
    
    return unique_locs


def load_geocoding_progress() -> Optional[pd.DataFrame]:
    """Load previous geocoding progress if it exists."""
    checkpoint_path = CITY_DATA_DIR / 'geocoding_checkpoint.csv'
    if checkpoint_path.exists():
        logger.info(f"Found existing geocoding checkpoint: {checkpoint_path}")
        df_existing = pd.read_csv(checkpoint_path)
        logger.info(f"Loaded {len(df_existing):,} previously geocoded locations")
        return df_existing
    return None


def save_geocoding_checkpoint(df: pd.DataFrame, progress_info: dict):
    """Save geocoding progress to allow resumption."""
    checkpoint_path = CITY_DATA_DIR / 'geocoding_checkpoint.csv'
    progress_path = CITY_DATA_DIR / 'geocoding_progress.json'
    
    logger.info(f"Saving checkpoint... ({progress_info['completed']}/{progress_info['total']} locations)")
    df.to_csv(checkpoint_path, index=False)
    
    # Save progress metadata
    with open(progress_path, 'w') as f:
        json.dump(progress_info, f, indent=2)


def reverse_geocode_locations(unique_locs: pd.DataFrame, batch_size: int = DEFAULT_BATCH_SIZE, 
                              geocoding_delay: float = DEFAULT_GEOCODING_DELAY) -> pd.DataFrame:
    """
    Reverse geocode locations with checkpoint/resume capability.
    
    Args:
        unique_locs: DataFrame with lat/long columns
    
    Returns:
        DataFrame with geocoded location information
    """
    print("Starting reverse geocoding with checkpoint support...")
    
    # Store original coordinates before any rounding
    unique_locs_original = unique_locs.copy()
    
    # Check for existing progress
    existing_geocoded = load_geocoding_progress()
    
    if existing_geocoded is not None:
        # DATA PROTECTION: Validate checkpoint integrity
        logger.info("Validating checkpoint data integrity...")
        
        # Drop the 'location' column if it exists (it's just the raw geocoding response)
        if 'location' in existing_geocoded.columns:
            existing_geocoded = existing_geocoded.drop(columns=['location'])
        
        # Check that checkpoint has required columns
        required_cols = ['lat', 'long', 'city', 'country']
        missing_cols = [col for col in required_cols if col not in existing_geocoded.columns]
        if missing_cols:
            logger.error(f"Checkpoint missing required columns: {missing_cols}")
            logger.error("Checkpoint appears corrupted. Starting fresh geocoding.")
            existing_geocoded = None
        else:
            # Round coordinates in existing data to ensure match
            existing_geocoded['lat'] = existing_geocoded['lat'].round(3)
            existing_geocoded['long'] = existing_geocoded['long'].round(3)
            
            # DATA PROTECTION: Check for coordinate overlap
            checkpoint_coords = set(zip(existing_geocoded['lat'], existing_geocoded['long']))
            current_coords = set(zip(unique_locs['lat'], unique_locs['long']))
            overlap = checkpoint_coords & current_coords
            
            logger.info(f"Checkpoint has {len(checkpoint_coords)} locations")
            logger.info(f"Current data has {len(current_coords)} locations")
            logger.info(f"Overlap: {len(overlap)} locations ({100*len(overlap)/len(current_coords):.1f}%)")
            
            if len(overlap) < len(checkpoint_coords) * 0.5:
                logger.warning("=" * 60)
                logger.warning("WARNING: Less than 50% overlap between checkpoint and current data!")
                logger.warning("This suggests the input data may have changed significantly.")
                logger.warning("Checkpoint will still be used, but verify results carefully.")
                logger.warning("=" * 60)
            
            # Merge existing results
            unique_locs = unique_locs.merge(
                existing_geocoded,
                on=['lat', 'long'],
                how='left',
                suffixes=('', '_existing')
            )
            
            # DATA PROTECTION: Verify merge didn't lose data
            if len(unique_locs) != len(unique_locs_original):
                logger.error(f"CRITICAL: Merge changed row count! Before: {len(unique_locs_original)}, After: {len(unique_locs)}")
                logger.error("This indicates a data integrity issue. Aborting to prevent data loss.")
                raise ValueError("Merge operation changed row count - potential data loss detected")
        
            # Identify locations that still need geocoding
            needs_geocoding = unique_locs[unique_locs['city'].isna()].copy()
            already_geocoded = unique_locs[unique_locs['city'].notna()].copy()
            
            logger.info("=" * 60)
            logger.info("RESUMING FROM CHECKPOINT")
            logger.info("=" * 60)
            logger.info(f"Already geocoded: {len(already_geocoded):,} locations")
            logger.info(f"Still need geocoding: {len(needs_geocoding):,} locations")
            logger.info(f"Progress: {100*len(already_geocoded)/len(unique_locs):.1f}% complete")
            
            # Calculate and display which batch we're resuming from
            resuming_batch = len(already_geocoded) // batch_size + 1
            logger.info(f"Resuming from batch {resuming_batch}")
            logger.info("=" * 60)
            
            if len(needs_geocoding) == 0:
                logger.info("All locations already geocoded!")
                return unique_locs
    else:
        needs_geocoding = unique_locs.copy()
        already_geocoded = pd.DataFrame()
    
    # Initialize geocoder with increased timeout
    geolocator = Nominatim(user_agent="vaycay_weather_geocoder", timeout=10)
    reverse = RateLimiter(geolocator.reverse, min_delay_seconds=geocoding_delay)
    
    def safe_reverse(row):
        """Safely reverse geocode a location with error handling."""
        try:
            location = reverse((row['lat'], row['long']), language='en')
            return location.raw if location else {}
        except Exception as e:
            print(f"Error geocoding ({row['lat']}, {row['long']}): {e}")
            return {}
    
    def extract_city(location):
        """Extract city name from geocoding result."""
        if location:
            address = location.get('address', {})
            return address.get('city', address.get('town', address.get('village', '')))
        return ''
    
    def extract_state(location):
        """Extract state/region from geocoding result."""
        if location:
            address = location.get('address', {})
            return address.get('state', address.get('county', ''))
        return ''
    
    def extract_country(location):
        """Extract country from geocoding result."""
        if location:
            address = location.get('address', {})
            return address.get('country', '')
        return ''
    
    def extract_suburb(location):
        """Extract suburb/municipality from geocoding result."""
        if location:
            address = location.get('address', {})
            return address.get('suburb', address.get('municipality', ''))
        return ''
    
    # Process locations in batches
    total_to_geocode = len(needs_geocoding)
    total_locations = len(unique_locs)
    already_completed = len(already_geocoded)
    start_time = time.time()
    failed_geocodes = []
    
    # Calculate which batch we're starting from
    starting_batch = already_completed // batch_size + 1 if already_completed > 0 else 1
    
    for i in range(0, total_to_geocode, batch_size):
        batch_end = min(i + batch_size, total_to_geocode)
        batch = needs_geocoding.iloc[i:batch_end].copy()
        
        # Calculate actual batch number (accounting for already completed)
        current_batch = starting_batch + (i // batch_size)
        actual_location_start = already_completed + i + 1
        actual_location_end = already_completed + batch_end
        
        logger.info(f"\nProcessing batch {current_batch} (locations {actual_location_start}-{actual_location_end} of {total_locations})")
        
        # Geocode batch with failure tracking
        batch['location'] = batch.apply(safe_reverse, axis=1)
        batch['city'] = batch['location'].apply(extract_city)
        batch['state'] = batch['location'].apply(extract_state)
        batch['country'] = batch['location'].apply(extract_country)
        batch['suburb'] = batch['location'].apply(extract_suburb)
        
        # Track failed geocodes
        failed_in_batch = batch[batch['city'] == '']
        if len(failed_in_batch) > 0:
            failed_geocodes.extend(failed_in_batch[['lat', 'long']].values.tolist())
        
        # Combine with already processed data
        if len(already_geocoded) > 0:
            combined = pd.concat([already_geocoded, batch], ignore_index=True)
        else:
            combined = batch
        
        # Save checkpoint
        progress_info = {
            'completed': len(combined),
            'total': total_locations,
            'failed_count': len(failed_geocodes),
            'last_updated': datetime.now().isoformat(),
            'current_batch': current_batch,
            'estimated_time_remaining_minutes': (
                (total_to_geocode - batch_end) * geocoding_delay / 60
            ) if batch_end < total_to_geocode else 0
        }
        save_geocoding_checkpoint(combined, progress_info)
        
        # Update already_geocoded for next iteration
        already_geocoded = combined
        
        # Progress update
        elapsed = time.time() - start_time
        locations_processed_this_session = batch_end
        rate = locations_processed_this_session / elapsed if elapsed > 0 else 0
        remaining = total_to_geocode - batch_end
        eta_seconds = remaining / rate if rate > 0 else 0
        
        overall_progress = len(combined)
        logger.info(f"Overall Progress: {overall_progress}/{total_locations} ({100*overall_progress/total_locations:.1f}%)")
        logger.info(f"This session: {locations_processed_this_session}/{total_to_geocode} locations")
        logger.info(f"Rate: {rate:.2f} locations/sec")
        logger.info(f"ETA for remaining: {eta_seconds/60:.1f} minutes")
    
    # Final save
    logger.info("\nGeocoding complete! Saving final results...")
    final_result = already_geocoded
    
    # Log failed geocodes
    if failed_geocodes:
        logger.warning(f"Failed to geocode {len(failed_geocodes)} locations")
        failed_path = CITY_DATA_DIR / 'failed_geocodes.json'
        with open(failed_path, 'w') as f:
            json.dump(failed_geocodes, f, indent=2)
        logger.info(f"Saved failed geocodes to: {failed_path}")
    
    # Save detailed version with location objects
    simplified_path = CITY_DATA_DIR / 'ALL_location_specific_data_simplified.csv'
    final_result.to_csv(simplified_path, index=False)
    logger.info(f"Saved simplified data to: {simplified_path}")
    
    # Save version without location objects for cleaner output
    output_cols = ['lat', 'long', 'city', 'state', 'country', 'suburb']
    full_path = CITY_DATA_DIR / 'ALL_location_specific_data.csv'
    final_result[output_cols].to_csv(full_path, index=False)
    logger.info(f"Saved full data to: {full_path}")
    
    return final_result


def merge_with_original(df_weather: pd.DataFrame, unique_locs: pd.DataFrame) -> pd.DataFrame:
    """Merge geocoded location data with original weather data."""
    logger.info("Merging location data with weather data...")
    
    # DATA PROTECTION: Store original row count
    original_row_count = len(df_weather)
    logger.info(f"Original weather data: {original_row_count:,} records")
    
    # Round coordinates in weather data to match geocoded data
    df_weather['lat'] = df_weather['lat'].round(3)
    df_weather['long'] = df_weather['long'].round(3)
    
    # Select only needed columns for merge
    location_cols = ['lat', 'long', 'city', 'state', 'country', 'suburb']
    merge_data = unique_locs[location_cols].copy()
    
    # DATA PROTECTION: Check for duplicates in merge key before merging
    merge_key_dups = merge_data.duplicated(subset=['lat', 'long']).sum()
    if merge_key_dups > 0:
        logger.warning(f"Found {merge_key_dups} duplicate lat/long pairs in geocoded data")
        logger.warning("Keeping first occurrence of each coordinate pair")
        merge_data = merge_data.drop_duplicates(subset=['lat', 'long'], keep='first')
    
    df_enriched = pd.merge(df_weather, merge_data, on=['lat', 'long'], how='left')
    
    # DATA PROTECTION: Verify merge didn't change row count
    if len(df_enriched) != original_row_count:
        logger.error(f"CRITICAL: Merge changed row count!")
        logger.error(f"Before: {original_row_count:,}, After: {len(df_enriched):,}")
        logger.error(f"Difference: {len(df_enriched) - original_row_count:,} rows")
        raise ValueError("Merge operation changed row count - potential data loss or duplication detected")
    
    # Check for unmatched records
    unmatched = df_enriched['city'].isnull().sum()
    if unmatched > 0:
        logger.warning(f"{unmatched:,} records ({100*unmatched/len(df_enriched):.2f}%) could not be matched to geocoded locations")
        
        # Save unmatched coordinates for investigation
        unmatched_coords = df_enriched[df_enriched['city'].isnull()][['lat', 'long']].drop_duplicates()
        unmatched_path = CITY_DATA_DIR / 'unmatched_coordinates.csv'
        unmatched_coords.to_csv(unmatched_path, index=False)
        logger.warning(f"Saved {len(unmatched_coords)} unmatched coordinate pairs to: {unmatched_path}")
    
    logger.info(f"Merged dataset has {len(df_enriched):,} records (verified: no data loss)")
    return df_enriched


def pivot_and_clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Pivot data and clean weather values with validation."""
    logger.info("Pivoting data by location and date...")
    
    df_pivot = df.pivot_table(
        index=['city', 'country', 'state', 'suburb', 'lat', 'long', 'date', 'name'],
        columns='data_type',
        values='value',
        aggfunc='first'
    ).reset_index()
    
    logger.info("Processing weather values...")
    
    # Fill missing TAVG with average of TMAX and TMIN
    if 'TAVG' in df_pivot.columns:
        if 'TMAX' in df_pivot.columns and 'TMIN' in df_pivot.columns:
            filled_count = df_pivot['TAVG'].isnull().sum()
            df_pivot['TAVG'] = df_pivot['TAVG'].fillna(
                df_pivot[['TMAX', 'TMIN']].mean(axis=1)
            )
            logger.info(f"Filled {filled_count:,} missing TAVG values using TMAX/TMIN average")
    
    # Convert temperatures from tenths of degrees to degrees
    for col in ['TMAX', 'TMIN', 'TAVG']:
        if col in df_pivot.columns:
            df_pivot[col] = df_pivot[col].div(10).round(2)
    
    # Handle precipitation if present
    if 'PRCP' in df_pivot.columns:
        df_pivot['PRCP'] = df_pivot['PRCP'].div(10).round(2)  # Convert to mm
    
    # Format date
    df_pivot['date'] = df_pivot['date'].dt.strftime('%Y-%m-%d')
    
    # Data quality checks
    for col in ['TMAX', 'TMIN', 'TAVG']:
        if col in df_pivot.columns:
            extreme_temps = (df_pivot[col] < -90) | (df_pivot[col] > 60)
            if extreme_temps.any():
                logger.warning(f"Found {extreme_temps.sum()} extreme {col} values (< -90°C or > 60°C)")
    
    logger.info(f"Final dataset has {len(df_pivot):,} records")
    return df_pivot


def validate_data(df: pd.DataFrame):
    """Run data validation checks."""
    logger.info("\n=== Data Validation ===")
    
    # Check for duplicates
    duplicates = df.duplicated(subset=['city', 'country', 'lat', 'long', 'date']).sum()
    if duplicates > 0:
        logger.warning(f"Found {duplicates:,} duplicate records")
    
    # Check data completeness
    completeness = (1 - df.isnull().sum() / len(df)) * 100
    logger.info("Data completeness by column:")
    for col, pct in completeness.items():
        logger.info(f"  {col}: {pct:.1f}%")
    
    # Check geographic coverage
    logger.info("\nGeographic coverage:")
    logger.info(f"  Unique countries: {df['country'].nunique()}")
    logger.info(f"  Unique cities: {df['city'].nunique()}")
    logger.info(f"  Latitude range: {df['lat'].min():.2f} to {df['lat'].max():.2f}")
    logger.info(f"  Longitude range: {df['long'].min():.2f} to {df['long'].max():.2f}")
    
    # Top countries by record count
    logger.info("\nTop 10 countries by record count:")
    top_countries = df['country'].value_counts().head(10)
    for country, count in top_countries.items():
        logger.info(f"  {country}: {count:,}")


def save_final_output(df: pd.DataFrame, output_dir: str, save_json: bool = True):
    """Save final cleaned data to CSV and optionally JSON."""
    logger.info("Saving final output...")
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Save CSV
    csv_path = output_path / 'global_weather_data_cleaned.csv'
    df.to_csv(csv_path, index=False)
    logger.info(f"Saved CSV to: {csv_path}")
    
    # Save JSON if requested
    if save_json:
        json_path = output_path / 'global_weather_data_cleaned.json'
        df.to_json(json_path, orient='records', force_ascii=False, indent=2)
        logger.info(f"Saved JSON to: {json_path}")
    
    # Print summary statistics
    logger.info("\n=== Summary Statistics ===")
    logger.info(f"Total records: {len(df):,}")
    logger.info(f"Unique cities: {df['city'].nunique():,}")
    logger.info(f"Unique countries: {df['country'].nunique():,}")
    logger.info(f"Date range: {df['date'].min()} to {df['date'].max()}")
    
    if 'TAVG' in df.columns:
        logger.info(f"Temperature range: {df['TAVG'].min():.1f}°C to {df['TAVG'].max():.1f}°C")
    
    # Save summary statistics
    summary = {
        'total_records': int(len(df)),
        'unique_cities': int(df['city'].nunique()),
        'unique_countries': int(df['country'].nunique()),
        'date_range': {
            'min': df['date'].min(),
            'max': df['date'].max()
        },
        'processing_timestamp': datetime.now().isoformat()
    }
    
    summary_path = output_path / 'processing_summary.json'
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    logger.info(f"Saved processing summary to: {summary_path}")


def main():
    """Main execution function."""
    args = parse_arguments()
    
    logger.info("=" * 80)
    logger.info("GLOBAL WEATHER DATA PROCESSING")
    logger.info("=" * 80)
    logger.info(f"Start time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("Configuration:")
    logger.info(f"  Input CSV: {args.input_csv}")
    logger.info(f"  Output directory: {args.output_dir}")
    logger.info(f"  Batch size: {args.batch_size}")
    logger.info(f"  Geocoding delay: {args.geocoding_delay}s")
    logger.info(f"  Skip geocoding: {args.skip_geocoding}")
    logger.info(f"  Resume only: {args.resume_only}")
    logger.info("")
    
    start_time = time.time()
    
    try:
        # Ensure output directories exist
        ensure_directories()
        
        # Step 1: Read and prepare weather data
        df_weather = read_and_prepare_data(args.input_csv)
        
        # Step 2: Get unique locations
        unique_locs = get_unique_locations(df_weather)
        
        # Step 3: Reverse geocode locations (with checkpoint support)
        if args.skip_geocoding:
            logger.info("Skipping geocoding, loading from checkpoint...")
            geocoded_data = load_geocoding_progress()
            if geocoded_data is None:
                raise ValueError("No geocoding checkpoint found. Run without --skip-geocoding first.")
        else:
            geocoded_data = reverse_geocode_locations(
                unique_locs, 
                batch_size=args.batch_size,
                geocoding_delay=args.geocoding_delay
            )
            
            if args.resume_only:
                logger.info("Resume-only mode: Geocoding complete, exiting.")
                return
        
        # Step 4: Merge with original weather data
        df_filled = merge_with_original(df_weather, geocoded_data)
        
        # Step 5: Pivot and clean data
        df_cleaned = pivot_and_clean_data(df_filled)
        
        # Step 6: Validate if requested
        if args.validate:
            validate_data(df_cleaned)
        
        # Step 7: Save final output
        save_final_output(df_cleaned, args.output_dir, save_json=not args.no_json)
        
        # Success!
        elapsed = time.time() - start_time
        logger.info(f"\n{'=' * 80}")
        logger.info(f"SUCCESS! Total time: {elapsed/60:.1f} minutes ({elapsed:.0f} seconds)")
        logger.info(f"End time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"{'=' * 80}")
        
    except Exception as e:
        logger.error(f"\n{'=' * 80}")
        logger.error(f"ERROR: {e}")
        logger.error(f"{'=' * 80}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
