import { enumType } from 'nexus';

// Enum for weather metrics
export const WeatherMetric = enumType({
  name: 'WeatherMetric',
  members: ['PRECIPITATION', 'AVG_TEMP', 'MAX_TEMP', 'MIN_TEMP'],
  description: 'Available weather metrics for querying',
});

// Enum for date format preferences
export const DateFormat = enumType({
  name: 'DateFormat',
  members: {
    MMDD: 'MMDD',
    YYYY_MM_DD: 'YYYY_MM_DD',
    ISO: 'ISO',
  },
  description: 'Date format options for queries',
});
