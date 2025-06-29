import React, { useState, useEffect } from 'react';
import { 
  RegionWiseAnalytics, 
  AvailableRegions
} from '../hooks/useTrafficData';

interface RegionAnalyticsProps {
  regionWiseAnalytics: RegionWiseAnalytics | null;
  availableRegions: AvailableRegions | null;
  onFetchRegionData: (timeRange: string, countryCode?: string, city?: string) => void;
  loading: boolean;
}

const RegionAnalytics: React.FC<RegionAnalyticsProps> = ({
  regionWiseAnalytics,
  availableRegions,
  onFetchRegionData,
  loading
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (availableRegions) {
      onFetchRegionData(selectedTimeRange, selectedCountry || undefined, selectedCity || undefined);
    }
  }, [availableRegions, selectedTimeRange, selectedCountry, selectedCity, onFetchRegionData]);

  useEffect(() => {
    if (selectedCountry && availableRegions) {
      const country = availableRegions.countries.find(c => c.code === selectedCountry);
      setAvailableCities(country?.cities || []);
      setSelectedCity(''); // Reset city when country changes
    } else {
      setAvailableCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry, availableRegions]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleTimeRangeChange = (timeRange: string) => {
    setSelectedTimeRange(timeRange);
  };

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedTimeRange('24h');
  };

  const getCountryFlag = (countryCode: string) => {
    const flagEmojis: Record<string, string> = {
      'US': '🇺🇸', 'CN': '🇨🇳', 'IN': '🇮🇳', 'GB': '🇬🇧', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'JP': '🇯🇵', 'BR': '🇧🇷', 'CA': '🇨🇦', 'AU': '🇦🇺',
      'RU': '🇷🇺', 'KR': '🇰🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'MX': '🇲🇽'
    };
    return flagEmojis[countryCode] || '🌍';
  };

  if (!availableRegions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading regions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Regional Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              id="time-range"
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {availableRegions.countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {getCountryFlag(country.code)} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!selectedCountry}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {regionWiseAnalytics && !loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pageviews</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {regionWiseAnalytics.regional_data.reduce((sum, region) => sum + region.pageviews, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {regionWiseAnalytics.regional_data.reduce((sum, region) => sum + region.unique_visitors, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.round(regionWiseAnalytics.regional_data.reduce((sum, region) => sum + region.avg_duration, 0) / Math.max(regionWiseAnalytics.regional_data.length, 1))}s
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.round(regionWiseAnalytics.regional_data.reduce((sum, region) => sum + region.bounce_rate, 0) / Math.max(regionWiseAnalytics.regional_data.length, 1))}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {regionWiseAnalytics.top_countries.map((country) => (
                  <div key={country.country_code} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCountryFlag(country.country_code)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{country.country_name}</p>
                        <p className="text-sm text-gray-500">{country.unique_visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{country.pageviews.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">pageviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Cities</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regionWiseAnalytics.top_cities.map((city) => (
                  <div key={`${city.city}-${city.country_name}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{city.city}</p>
                      <p className="text-sm text-gray-500">{city.country_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{city.pageviews.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{city.unique_visitors.toLocaleString()} visitors</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources by Region</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(regionWiseAnalytics.traffic_sources).map(([source, count]) => (
                  <div key={source} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{count.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 capitalize">{source}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(regionWiseAnalytics.device_breakdown).map(([device, percentage]) => (
                  <div key={device} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-semibold text-gray-900">{percentage}%</p>
                    <p className="text-sm text-gray-500">{device}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Data Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Regional Data</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pageviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bounce Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regionWiseAnalytics.regional_data.map((region) => (
                    <tr key={`${region.country_code}-${region.city}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getCountryFlag(region.country_code)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{region.city}</div>
                            <div className="text-sm text-gray-500">{region.country_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {region.pageviews.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {region.unique_visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(region.avg_duration)}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {region.bounce_rate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionAnalytics; 