import { env } from '../env';
import { CurrentWeather } from '../types/weather';

const KEY = env.WEATHER_API_KEY;
const BASE_URL = `https://api.weatherapi.com/v1/current.json?key=${KEY}`;

export const getCurrentWeather = async (data: {
  latitude: number;
  longitude: number;
}): Promise<CurrentWeather> => {
  const url = `${BASE_URL}&q=${data.latitude},${data.longitude}`;
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Weather API error: ${body.error.message}`);
  }
  return body as CurrentWeather;
};
