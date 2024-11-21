import { useState, useEffect } from 'react';

interface TrafficEntry {
  id: string;
  domain: string;
  protocol: 'HTTP' | 'HTTPS';
  requestCount: number;
  responseTime: number;
  status: number;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:8000';

export const useTrafficData = (url: string | null) => {
  const [trafficData, setTrafficData] = useState<TrafficEntry[]>([]);
  const [chartData, setChartData] = useState<{ timestamp: string; http: number; https: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Check if the server is running
  const checkServer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      if (response.ok) {
        setIsServerConnected(true);
        return true;
      }
      return false;
    } catch (err) {
      setIsServerConnected(false);
      setError('Cannot connect to analysis server. Please ensure the Python server is running.');
      return false;
    }
  };

  const analyzeUrl = async (targetUrl: string) => {
    try {
      if (!isServerConnected && !(await checkServer())) {
        return;
      }

      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Fetch updated traffic data
      const dataResponse = await fetch(`${API_BASE_URL}/data`);
      if (!dataResponse.ok) {
        throw new Error(`HTTP error! status: ${dataResponse.status}`);
      }
      
      const trafficEntries = await dataResponse.json();
      setTrafficData(trafficEntries);
      
      // Update chart data
      const httpCount = trafficEntries.filter((entry: TrafficEntry) => entry.protocol === 'HTTP').length;
      const httpsCount = trafficEntries.filter((entry: TrafficEntry) => entry.protocol === 'HTTPS').length;
      
      setChartData(prev => {
        const newData = [
          ...prev,
          {
            timestamp: result.data.timestamp,
            http: httpCount,
            https: httpsCount,
          },
        ].slice(-10);
        return newData;
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the URL');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial server check
  useEffect(() => {
    checkServer();
  }, []);

  useEffect(() => {
    if (url && isServerConnected) {
      analyzeUrl(url);
      
      const interval = setInterval(() => {
        analyzeUrl(url);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [url, isServerConnected]);

  return { trafficData, chartData, isLoading, error, isServerConnected };
};