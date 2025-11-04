"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WEATHER_ICONS_MAP } from "@/types/weather";
import type { WeatherData } from "@/types/weather";
import { Wind, Droplets, Eye, Gauge } from "lucide-react";
import { formatTime } from "@/lib/date-utils";

interface CurrentWeatherProps {
  location?: string;
  country?: string;
  coords?: { lat: number; lon: number };
}

export default function CurrentWeather({ location, country, coords }: CurrentWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        let url = "/api/weather/current?";

        if (location) {
          url += `city=${encodeURIComponent(location)}`;
          if (country) {
            url += `&country=${country}`;
          }
        } else if (coords) {
          url += `lat=${coords.lat}&lon=${coords.lon}`;
        } else {
          setError("No location information provided");
          setLoading(false);
          return;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setWeather(result.data);
        } else {
          setError(result.error || "Failed to fetch weather");
        }
      } catch (err) {
        setError("Network error");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location, country, coords]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading weather...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            {error || "No weather data available"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const weatherEmoji = WEATHER_ICONS_MAP[weather.icon] || "☁️";
  
  // Format sunrise and sunset times safely
  const sunrise = formatTime(weather.sunrise);
  const sunset = formatTime(weather.sunset);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {weather.location}
          {weather.country && `, ${weather.country}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main weather display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{weatherEmoji}</div>
              <div>
                <div className="text-4xl font-bold">{weather.temperature}°C</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {weather.description}
                </div>
                <div className="text-xs text-muted-foreground">
                  Feels like {weather.feelsLike}°C
                </div>
              </div>
            </div>
          </div>

          {/* Temperature range */}
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">High: </span>
              <span className="font-medium">{weather.tempMax}°C</span>
            </div>
            <div>
              <span className="text-muted-foreground">Low: </span>
              <span className="font-medium">{weather.tempMin}°C</span>
            </div>
          </div>

          {/* Weather details grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Wind</div>
                <div className="text-sm font-medium">{weather.windSpeed} m/s</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Humidity</div>
                <div className="text-sm font-medium">{weather.humidity}%</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Visibility</div>
                <div className="text-sm font-medium">{(weather.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Pressure</div>
                <div className="text-sm font-medium">{weather.pressure} hPa</div>
              </div>
            </div>
          </div>

          {/* Sun times */}
          <div className="flex justify-between text-sm pt-4 border-t">
            <div>
              <div className="text-xs text-muted-foreground">Sunrise</div>
              <div className="font-medium">🌅 {sunrise}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Sunset</div>
              <div className="font-medium">🌇 {sunset}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
