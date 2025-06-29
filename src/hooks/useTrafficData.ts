import { useState, useEffect, useCallback } from 'react';

export interface AnalyticsSummary {
  pageviews: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  traffic_sources: Record<string, number>;
  top_pages: Array<{ url: string; count: number }>;
  device_breakdown: Record<string, number>;
  time_range: string;
}

export interface RealTimeData {
  active_sessions: number;
  hourly_pageviews: number;
  pageviews_per_minute: number;
  timestamp: string;
}

export interface SEOMetrics {
  load_time: number;
  core_web_vitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  keyword_rankings: Record<string, number>;
  backlinks_count: number;
  seo_score: number;
}

export interface ConversionFunnel {
  funnel_name: string;
  steps: Array<{
    step: string;
    visitors: number;
    conversion_rate: number;
  }>;
  total_conversion_rate: number;
}

export interface HeatmapData {
  x: number;
  y: number;
  event_type: string;
  intensity: number;
}

export interface RegionalData {
  country_code: string;
  country_name: string;
  city: string;
  pageviews: number;
  unique_visitors: number;
  avg_duration: number;
  bounce_rate: number;
}

export interface TopCountry {
  country_code: string;
  country_name: string;
  pageviews: number;
  unique_visitors: number;
}

export interface TopCity {
  city: string;
  country_name: string;
  pageviews: number;
  unique_visitors: number;
}

export interface RegionWiseAnalytics {
  regional_data: RegionalData[];
  top_countries: TopCountry[];
  top_cities: TopCity[];
  traffic_sources: Record<string, number>;
  device_breakdown: Record<string, number>;
  time_range: string;
  filter: {
    country_code: string | null;
    city: string | null;
  };
}

export interface AvailableRegion {
  code: string;
  name: string;
  cities: string[];
}

export interface AvailableRegions {
  countries: AvailableRegion[];
}

const API_BASE_URL = 'http://localhost:8001';

export const useTrafficData = () => {
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [regionWiseAnalytics, setRegionWiseAnalytics] = useState<RegionWiseAnalytics | null>(null);
  const [availableRegions, setAvailableRegions] = useState<AvailableRegions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  // Check server connection
  const checkServer = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/summary`);
      if (response.ok) {
        setIsServerConnected(true);
        setError(null);
        return true;
      }
      return false;
    } catch {
      setIsServerConnected(false);
      setError('Cannot connect to analytics server. Please ensure the Python server is running.');
      return false;
    }
  }, []);

  // Fetch analytics summary
  const fetchAnalyticsSummary = useCallback(async (url?: string, timeRange?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (url) params.append('url', url);
      if (timeRange) params.append('time_range', timeRange);
      
      const response = await fetch(`${API_BASE_URL}/analytics/summary?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setAnalyticsSummary(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics summary');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch real-time data
  const fetchRealTimeData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/realtime`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setRealTimeData(result.data);
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  }, []);

  // Analyze SEO metrics
  const analyzeSEO = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/seo/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setSeoMetrics(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze SEO metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch conversion funnel
  const fetchConversionFunnel = useCallback(async (funnelName: string = 'default') => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/funnel?name=${funnelName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setConversionFunnel(result.data);
    } catch (err) {
      console.error('Failed to fetch conversion funnel:', err);
    }
  }, []);

  // Fetch heatmap data
  const fetchHeatmapData = useCallback(async (pageUrl: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/heatmap?page_url=${encodeURIComponent(pageUrl)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setHeatmapData(result.data);
    } catch (err) {
      console.error('Failed to fetch heatmap data:', err);
    }
  }, []);

  // Track pageview
  const trackPageview = useCallback(async (data: {
    url: string;
    user_agent?: string;
    ip_address?: string;
    referrer?: string;
    time_on_page?: number;
    bounce?: boolean;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/track/pageview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      console.error('Failed to track pageview:', err);
      return null;
    }
  }, []);

  // Track custom event
  const trackEvent = useCallback(async (data: {
    session_id?: string;
    event_type: string;
    event_data?: Record<string, unknown>;
    page_url?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/track/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      console.error('Failed to track event:', err);
      return null;
    }
  }, []);

  // Track heatmap data
  const trackHeatmap = useCallback(async (data: {
    page_url: string;
    x_coord: number;
    y_coord: number;
    event_type: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/track/heatmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (err) {
      console.error('Failed to track heatmap data:', err);
      return null;
    }
  }, []);

  // Fetch region-wise analytics
  const fetchRegionWiseAnalytics = useCallback(async (timeRange: string = '24h', countryCode?: string, city?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('time_range', timeRange);
      if (countryCode) params.append('country_code', countryCode);
      if (city) params.append('city', city);
      
      const response = await fetch(`${API_BASE_URL}/analytics/regions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setRegionWiseAnalytics(result.data);
    } catch (err) {
      console.error('Failed to fetch region-wise analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch available regions
  const fetchAvailableRegions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/available-regions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setAvailableRegions(result.data);
    } catch (err) {
      console.error('Failed to fetch available regions:', err);
    }
  }, []);

  // Initial setup
  useEffect(() => {
    checkServer();
  }, [checkServer]);

  // Auto-refresh real-time data
  useEffect(() => {
    if (isServerConnected) {
      fetchRealTimeData();
      fetchAvailableRegions();
      const interval = setInterval(fetchRealTimeData, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isServerConnected, fetchRealTimeData, fetchAvailableRegions]);

  // Auto-refresh analytics summary
  useEffect(() => {
    if (isServerConnected) {
      fetchAnalyticsSummary(selectedUrl, selectedTimeRange);
      const interval = setInterval(() => {
        fetchAnalyticsSummary(selectedUrl, selectedTimeRange);
      }, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [isServerConnected, selectedUrl, selectedTimeRange, fetchAnalyticsSummary]);

  return {
    // Data
    analyticsSummary,
    realTimeData,
    seoMetrics,
    conversionFunnel,
    heatmapData,
    regionWiseAnalytics,
    availableRegions,
    
    // State
    isLoading,
    error,
    isServerConnected,
    selectedTimeRange,
    selectedUrl,
    
    // Actions
    setSelectedTimeRange,
    setSelectedUrl,
    fetchAnalyticsSummary,
    fetchRealTimeData,
    analyzeSEO,
    fetchConversionFunnel,
    fetchHeatmapData,
    trackPageview,
    trackEvent,
    trackHeatmap,
    checkServer,
    fetchRegionWiseAnalytics,
    fetchAvailableRegions,
  };
};