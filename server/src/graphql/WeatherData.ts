import { objectType, queryField, nonNull, stringArg, intArg, list } from 'nexus';

// GraphQL WeatherData type definition
export const WeatherData = objectType({
  name: 'WeatherData',
  description: 'Weather data for a specific location and date',
  definition(t) {
    t.nonNull.string('city', { description: 'City name' });
    t.string('country', { description: 'Country name' });
    t.string('state', { description: 'State or region' });
    t.string('suburb', { description: 'Suburb or district' });
    t.nonNull.string('date', { description: 'Date in YYYY-MM-DD format' });
    t.float('lat', { description: 'Latitude coordinate' });
    t.float('long', { description: 'Longitude coordinate' });
    t.float('population', { description: 'City population' });
    t.float('precipitation', { description: 'Precipitation in mm' });
    t.float('snowDepth', { description: 'Snow depth in mm' });
    t.float('avgTemperature', { description: 'Average temperature in °C' });
    t.float('maxTemperature', { description: 'Maximum temperature in °C' });
    t.float('minTemperature', { description: 'Minimum temperature in °C' });
    t.nonNull.string('stationName', { description: 'Weather station name' });
    t.string('submitterId', { description: 'Data submitter ID' });
  },
});

// Helper function to transform Prisma data to GraphQL format
function transformWeatherData(data: any) {
  return {
    city: data.city,
    country: data.country,
    state: data.state,
    suburb: data.suburb,
    date: data.date,
    lat: data.lat ? parseFloat(data.lat) : null,
    long: data.long ? parseFloat(data.long) : null,
    population: data.population,
    precipitation: data.PRCP,
    snowDepth: data.SNWD,
    avgTemperature: data.TAVG,
    maxTemperature: data.TMAX,
    minTemperature: data.TMIN,
    stationName: data.name,
    submitterId: data.submitter_id,
  };
}

// Query: Get all weather data (paginated)
export const weatherDataQuery = queryField('weatherData', {
  type: list('WeatherData'),
  description: 'Get all weather data with pagination',
  args: {
    limit: intArg({ default: 10, description: 'Number of records to return' }),
    offset: intArg({ default: 0, description: 'Number of records to skip' }),
  },
  async resolve(_parent, args, context) {
    const data = await context.prisma.weatherData.findMany({
      take: args.limit || 10,
      skip: args.offset || 0,
    });
    
    return data.map(transformWeatherData);
  },
});

// Query: Get weather by date (MMDD format)
export const weatherByDateQuery = queryField('weatherByDate', {
  type: list('WeatherData'),
  description: 'Get weather data for a specific date (MMDD format, e.g., "0315" for March 15)',
  args: {
    monthDay: nonNull(stringArg({ description: 'Date in MMDD format (e.g., "0315")' })),
  },
  async resolve(_parent, args, context) {
    // Convert MMDD to 2020-MM-DD format (matching Python API logic)
    const month = args.monthDay.slice(0, 2);
    const day = args.monthDay.slice(2);
    const dateStr = `2020-${month}-${day}`;
    
    const data = await context.prisma.weatherData.findMany({
      where: { date: dateStr },
      take: 100,
    });
    
    return data.map(transformWeatherData);
  },
});

// Query: Get weather by city
export const weatherByCityQuery = queryField('weatherByCity', {
  type: list('WeatherData'),
  description: 'Get weather data for a specific city',
  args: {
    city: nonNull(stringArg({ description: 'City name (case-insensitive)' })),
  },
  async resolve(_parent, args, context) {
    // Title case the city name (matching Python API logic)
    const cityName = args.city.charAt(0).toUpperCase() + args.city.slice(1).toLowerCase();
    
    const data = await context.prisma.weatherData.findMany({
      where: { city: cityName },
      take: 100,
    });
    
    return data.map(transformWeatherData);
  },
});

// Query: Get all unique cities
export const citiesQuery = queryField('cities', {
  type: list('String'),
  description: 'Get list of all unique cities in the database',
  async resolve(_parent, _args, context) {
    const cities = await context.prisma.weatherData.findMany({
      distinct: ['city'],
      select: { city: true },
      orderBy: { city: 'asc' },
    });
    
    return cities.map((c: { city: string }) => c.city);
  },
});

// Query: Get all unique countries
export const countriesQuery = queryField('countries', {
  type: list('String'),
  description: 'Get list of all unique countries in the database',
  async resolve(_parent, _args, context) {
    const countries = await context.prisma.weatherData.findMany({
      distinct: ['country'],
      select: { country: true },
      where: { country: { not: null } },
      orderBy: { country: 'asc' },
    });
    
    return countries.map((c: { country: string | null }) => c.country).filter(Boolean) as string[];
  },
});
