import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  AlertCircle, 
  BarChart3, 
  Users, 
  Clock, 
  MousePointer, 
  Globe, 
  TrendingUp, 
  Eye,
  Zap,
  Settings,
  Bell,
  Filter
} from 'lucide-react';
import { AnalyticsDashboard } from './components/TrafficChart';
import { AnalyticsTable } from './components/TrafficTable';
import { HeatmapVisualizer } from './components/HeatmapVisualizer';
import { SessionRecorder } from './components/SessionRecorder';
import { useTrafficData } from './hooks/useTrafficData';
import RegionAnalytics from './components/RegionAnalytics';

function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [url, setUrl] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(true);
  
  const {
    analyticsSummary,
    realTimeData,
    seoMetrics,
    conversionFunnel,
    heatmapData,
    regionWiseAnalytics,
    availableRegions,
    isLoading,
    error,
    isServerConnected,
    selectedTimeRange,
    selectedUrl,
    setSelectedTimeRange,
    setSelectedUrl,
    analyzeSEO,
    fetchConversionFunnel,
    fetchHeatmapData,
    trackPageview,
    fetchRegionWiseAnalytics,
  } = useTrafficData();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      setSelectedUrl(formattedUrl);
      setShowUrlInput(false);
      
      // Analyze SEO for the URL
      await analyzeSEO(formattedUrl);
      
      // Fetch conversion funnel
      await fetchConversionFunnel('default');
      
      // Fetch heatmap data
      await fetchHeatmapData(formattedUrl);
      
      // Simulate tracking a pageview
      await trackPageview({
        url: formattedUrl,
        user_agent: navigator.userAgent,
        ip_address: '127.0.0.1',
        time_on_page: 120,
        bounce: false
      });
    }
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'realtime', name: 'Real-time', icon: Activity },
    { id: 'seo', name: 'SEO Analytics', icon: TrendingUp },
    { id: 'behavior', name: 'User Behavior', icon: Users },
    { id: 'heatmap', name: 'Heatmaps', icon: MousePointer },
    { id: 'sessions', name: 'Session Recordings', icon: Eye },
    { id: 'funnels', name: 'Conversion Funnels', icon: Zap },
    { id: 'regions', name: 'Region Analytics', icon: Globe },
  ];

  // Simulate session recording data
  const mockSessionRecording = {
    id: 'session-1',
    session_id: 'sess_123456789',
    start_time: new Date().toISOString(),
    duration: 180000, // 3 minutes
    events: [
      { id: '1', timestamp: 0, event_type: 'pageview' as const, page_url: 'https://example.com' },
      { id: '2', timestamp: 5000, event_type: 'click' as const, x: 150, y: 200, element: 'button', page_url: 'https://example.com' },
      { id: '3', timestamp: 15000, event_type: 'scroll' as const, x: 0, y: 300, page_url: 'https://example.com' },
      { id: '4', timestamp: 30000, event_type: 'hover' as const, x: 250, y: 150, element: 'link', page_url: 'https://example.com' },
      { id: '5', timestamp: 45000, event_type: 'click' as const, x: 250, y: 150, element: 'link', page_url: 'https://example.com/products' },
      { id: '6', timestamp: 60000, event_type: 'pageview' as const, page_url: 'https://example.com/products' },
      { id: '7', timestamp: 90000, event_type: 'form_submit' as const, page_url: 'https://example.com/checkout' },
    ],
    user_agent: navigator.userAgent,
    device_type: 'Desktop',
    location: 'New York, US'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">JADTrax</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isServerConnected && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">Server disconnected</span>
                </div>
              )}
              
              <button 
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              
              <button 
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Input */}
        {showUrlInput && (
          <div className="mb-8">
            <form onSubmit={handleUrlSubmit} className="max-w-2xl">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL to analyze (e.g., example.com)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    disabled={!isServerConnected}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !isServerConnected}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 disabled:opacity-50 text-lg"
                >
                  <Search className="w-5 h-5" />
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Time Range Selector */}
        {selectedUrl && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Analytics for {selectedUrl}
              </h2>
              <button
                onClick={() => setShowUrlInput(true)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Change URL
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedTimeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select time range"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        {selectedUrl && (
          <div className="mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Tab Content */}
        {selectedUrl && (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <AnalyticsDashboard
                analyticsSummary={analyticsSummary}
                realTimeData={realTimeData}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'realtime' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Real-time Activity</h3>
                {realTimeData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <Activity className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-blue-900">{realTimeData.active_sessions}</p>
                      <p className="text-sm text-blue-600">Active Sessions</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-green-900">{realTimeData.hourly_pageviews}</p>
                      <p className="text-sm text-green-600">Pageviews (Last Hour)</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <Clock className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-purple-900">{realTimeData.pageviews_per_minute}</p>
                      <p className="text-sm text-purple-600">Pageviews/Minute</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No real-time data available</p>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                {seoMetrics ? (
                  <>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4">SEO Score</h3>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white">
                          <div className="text-center">
                            <p className="text-3xl font-bold">{seoMetrics.seo_score}</p>
                            <p className="text-sm">/ 100</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <AnalyticsTable
                      analyticsSummary={analyticsSummary}
                      seoMetrics={seoMetrics}
                      conversionFunnel={conversionFunnel}
                      isLoading={isLoading}
                    />
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No SEO metrics available. Run an SEO analysis first.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'behavior' && (
              <AnalyticsTable
                analyticsSummary={analyticsSummary}
                seoMetrics={seoMetrics}
                conversionFunnel={conversionFunnel}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'heatmap' && (
              <HeatmapVisualizer
                heatmapData={heatmapData}
                pageUrl={selectedUrl}
              />
            )}

            {activeTab === 'sessions' && (
              <SessionRecorder
                sessionRecording={mockSessionRecording}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'funnels' && (
              <div className="space-y-6">
                {conversionFunnel ? (
                  <AnalyticsTable
                    analyticsSummary={analyticsSummary}
                    seoMetrics={seoMetrics}
                    conversionFunnel={conversionFunnel}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No conversion funnel data available.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'regions' && (
              <RegionAnalytics
                regionWiseAnalytics={regionWiseAnalytics}
                availableRegions={availableRegions}
                onFetchRegionData={fetchRegionWiseAnalytics}
                loading={isLoading}
              />
            )}
          </div>
        )}

        {/* Welcome State */}
        {!selectedUrl && (
          <div className="text-center py-16">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to JADTrax</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Enter a website URL above to start analyzing traffic patterns, user behavior, 
              regional performance, and more. Get comprehensive insights to optimize your website globally.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow">
                <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-sm text-gray-600">Monitor live traffic and user activity</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <Globe className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Regional Insights</h3>
                <p className="text-sm text-gray-600">Track performance across countries and cities</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Advanced Tracking</h3>
                <p className="text-sm text-gray-600">Heatmaps, sessions, and conversion funnels</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;