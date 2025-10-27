import useSWR from "swr";
import { CityWeatherData } from "../../types/cityWeatherDataType";
import { getRequest } from "../api";

export function useFetchSpecifiedDate(date: string) {

  const api_url = `/day/${date}`;

  const { data, error, isLoading } = useSWR<CityWeatherData[], Error>(
    api_url,
    (url) => getRequest(url, null),
    { revalidateOnFocus: false }
  );

  return {
    dataReturned: data,
    isLoading,
    isError: error,
  };
}
