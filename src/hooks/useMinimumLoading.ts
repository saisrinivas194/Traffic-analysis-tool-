import { useState, useEffect } from 'react';

/**
 * Custom hook to ensure loading states display for at least 2 seconds
 * @param actualLoading - The actual loading state from your data fetching
 * @returns boolean - True if should show loading (either actual loading or minimum time not met)
 */
export const useMinimumLoading = (actualLoading: boolean): boolean => {
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    // Start the minimum 2-second timer when component mounts
    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading if either actual loading is true OR minimum time hasn't elapsed
  return actualLoading || !minimumTimeElapsed;
};

export default useMinimumLoading;
