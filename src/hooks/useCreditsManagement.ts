import { useState, useEffect, useCallback } from "react";

interface UseCreditsManagementReturn {
  credits: number;
  isLoading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
  canAfford: (cost: number) => boolean;
  getRemainingGenerations: (cost: number) => number;
}

/**
 * Custom hook for managing user credits
 * Handles fetching, updating, and calculating credit availability
 */
export function useCreditsManagement(): UseCreditsManagementReturn {
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/get-user-credits");
      const data = await response.json();

      if (data.code === 0 && data.data) {
        setCredits(data.data.left_credits || 0);
      } else {
        throw new Error(data.msg || "Failed to fetch credits");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch user credits:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Check if user can afford a specific cost
  const canAfford = useCallback(
    (cost: number): boolean => {
      return credits >= cost;
    },
    [credits]
  );

  // Calculate how many generations are possible with current credits
  const getRemainingGenerations = useCallback(
    (cost: number): number => {
      return Math.floor(credits / cost);
    },
    [credits]
  );

  return {
    credits,
    isLoading,
    error,
    refreshCredits: fetchCredits,
    canAfford,
    getRemainingGenerations,
  };
}
