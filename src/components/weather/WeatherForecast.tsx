"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WEATHER_ICONS_MAP } from "@/types/weather";
import type { SimpleForecast } from "@/types/weather";
import { formatDate, formatWeekday } from "@/lib/date-utils";

interface WeatherForecastProps {
  location?: string;
  country?: string;
  coords?: { lat: number; lon: number };
}

export default function WeatherForecast({ location, country, coords }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<SimpleForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        setError(null);

        let url = "/api/weather/forecast?";

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
          setForecast(result.data);
        } else {
          setError(result.error || "Failed to fetch forecast");
        }
      } catch (err) {
        setError("Network error");
        console.error("Forecast fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [location, country, coords]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading forecast...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !forecast.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            {error || "No forecast data available"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {forecast.map((day, index) => {
            const weatherEmoji = WEATHER_ICONS_MAP[day.icon] || "☁️";
            const dayName = formatWeekday(day.date);
            const dateStr = formatDate(day.date);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                {/* Date */}
                <div className="flex flex-col min-w-[80px]">
                  <div className="text-sm font-medium">{dayName}</div>
                  <div className="text-xs text-muted-foreground">{dateStr}</div>
                </div>

                {/* Weather icon and condition */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-3xl">{weatherEmoji}</div>
                  <div className="flex flex-col">
                    <div className="text-sm capitalize">{day.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {day.precipitation > 0 && `💧 ${Math.round(day.precipitation)}%`}
                    </div>
                  </div>
                </div>

                {/* Temperature range */}
                <div className="flex gap-3 items-center min-w-[100px] justify-end">
                  <div className="text-sm text-muted-foreground">{day.tempMin}°</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" />
                  <div className="text-sm font-medium">{day.tempMax}°</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
