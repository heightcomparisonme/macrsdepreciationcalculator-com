export interface WeatherCoordinates {
  lat: number;
  lon: number;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherRain {
  "1h"?: number;
  "3h"?: number;
}

export interface WeatherSnow {
  "1h"?: number;
  "3h"?: number;
}

export interface WeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherResponse {
  coord: WeatherCoordinates;
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  rain?: WeatherRain;
  snow?: WeatherSnow;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudiness: number;
  visibility: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: Date | string; // Can be Date object or ISO string after JSON serialization
  sunset: Date | string; // Can be Date object or ISO string after JSON serialization
  timestamp: Date | string; // Can be Date object or ISO string after JSON serialization
}

export interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  clouds: WeatherClouds;
  wind: WeatherWind;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: WeatherRain;
  snow?: WeatherSnow;
  sys: {
    pod: string; // Part of day (d/n)
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: WeatherCoordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface SimpleForecast {
  date: Date;
  temperature: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export const WEATHER_ICONS_MAP: Record<string, string> = {
  "01d": "☀️", // clear sky day
  "01n": "🌙", // clear sky night
  "02d": "⛅", // few clouds day
  "02n": "☁️", // few clouds night
  "03d": "☁️", // scattered clouds
  "03n": "☁️", // scattered clouds
  "04d": "☁️", // broken clouds
  "04n": "☁️", // broken clouds
  "09d": "🌧️", // shower rain
  "09n": "🌧️", // shower rain
  "10d": "🌦️", // rain day
  "10n": "🌧️", // rain night
  "11d": "⛈️", // thunderstorm
  "11n": "⛈️", // thunderstorm
  "13d": "❄️", // snow
  "13n": "❄️", // snow
  "50d": "🌫️", // mist
  "50n": "🌫️", // mist
};
