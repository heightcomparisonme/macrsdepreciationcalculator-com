import { useState, useEffect, useCallback } from "react";

interface MoonData {
  moonSign: string;
  moonPhase: string;
  element: string;
  illumination?: number;
  zodiacSign?: string;
  phase?: string;
}

interface UseMoonDataReturn {
  moonData: MoonData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching today's moon data
 * Handles API calls to /api/moon/today with caching and error handling
 */
export function useMoonData(): UseMoonDataReturn {
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoonData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if data is cached (valid for 1 hour)
      const cached = localStorage.getItem("moonData");
      const cacheTimestamp = localStorage.getItem("moonDataTimestamp");

      if (cached && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp, 10);
        const ONE_HOUR = 60 * 60 * 1000;

        if (age < ONE_HOUR) {
          setMoonData(JSON.parse(cached));
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const response = await fetch("/api/moon/today");
      const data = await response.json();

      if (data.code === 0 && data.data) {
        const { zodiacSign, phase, element, illumination } = data.data;
        const moonDataObj: MoonData = {
          moonSign: zodiacSign || "",
          moonPhase: phase || "",
          element: element || "",
          illumination: illumination,
          zodiacSign: zodiacSign,
          phase: phase,
        };

        setMoonData(moonDataObj);

        // Cache the data
        localStorage.setItem("moonData", JSON.stringify(moonDataObj));
        localStorage.setItem("moonDataTimestamp", Date.now().toString());
      } else {
        throw new Error(data.msg || "Failed to fetch moon data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch moon data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch moon data on mount
  useEffect(() => {
    fetchMoonData();
  }, [fetchMoonData]);

  return {
    moonData,
    isLoading,
    error,
    refetch: fetchMoonData,
  };
}
