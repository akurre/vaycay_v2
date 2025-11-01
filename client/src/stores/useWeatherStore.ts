import { create } from 'zustand';
import { WeatherData } from '../types/cityWeatherDataType';

interface WeatherStore {
  displayedWeatherData: WeatherData[] | null;
  isLoadingWeather: boolean;
  setDisplayedWeatherData: (data: WeatherData[] | null) => void;
  setIsLoadingWeather: (isLoading: boolean) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  displayedWeatherData: null,
  isLoadingWeather: false,
  setDisplayedWeatherData: (data) => set({ displayedWeatherData: data }),
  setIsLoadingWeather: (isLoading) => set({ isLoadingWeather: isLoading }),
}));
