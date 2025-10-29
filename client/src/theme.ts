import { createTheme } from '@mantine/core';

// Custom color palette for the application
export const appColors = {
  primary: '#2563eb', // blue-600
  primaryLight: '#3b82f6', // blue-500
  primaryDark: '#1d4ed8', // blue-700
} as const;

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Arial, sans-serif',
  defaultRadius: 'md',
});
