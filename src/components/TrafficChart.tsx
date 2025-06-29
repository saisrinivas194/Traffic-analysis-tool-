import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, MousePointer } from 'lucide-react';

interface AnalyticsSummary {
  pageviews: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  traffic_sources: Record<string, number>;
  top_pages: Array<{ url: string; count: number }>;
  device_breakdown: Record<string, number>;
  time_range: string;
}

interface RealTimeData {
  active_sessions: number;
  hourly_pageviews: number;
  pageviews_per_minute: number;
  timestamp: string;
}

interface AnalyticsDashboardProps {
  analyticsSummary: AnalyticsSummary | null;
  realTimeData: RealTimeData | null;
  isLoading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analyticsSummary,
  realTimeData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsSummary) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  // Prepare data for charts
  const trafficSourcesData = Object.entries(analyticsSummary.traffic_sources).map(([source, count]) => ({
    name: source,
    value: count
  }));

  const deviceBreakdownData = Object.entries(analyticsSummary.device_breakdown).map(([device, count]) => ({
    name: device,
    value: count
  }));

  const topPagesData = analyticsSummary.top_pages.slice(0, 5).map(page => ({
    name: page.url.length > 30 ? page.url.substring(0, 30) + '...' : page.url,
    pageviews: page.count
  }));

  // Simulate time series data
  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    pageviews: Math.floor(Math.random() * 100) + 50,
    visitors: Math.floor(Math.random() * 80) + 30
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pageviews</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsSummary.pageviews.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          {realTimeData && (
            <p className="text-xs text-gray-500 mt-2">
              {realTimeData.pageviews_per_minute} per minute
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsSummary.unique_visitors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
          {realTimeData && (
            <p className="text-xs text-gray-500 mt-2">
              {realTimeData.active_sessions} active sessions
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsSummary.bounce_rate}%</p>
            </div>
            <MousePointer className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {analyticsSummary.bounce_rate > 70 ? 'High' : analyticsSummary.bounce_rate > 40 ? 'Medium' : 'Low'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(analyticsSummary.avg_session_duration)}s</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {analyticsSummary.avg_session_duration > 180 ? 'Excellent' : analyticsSummary.avg_session_duration > 60 ? 'Good' : 'Needs improvement'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="pageviews" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="visitors" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPagesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="pageviews" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real-time Activity */}
      {realTimeData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Real-time Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{realTimeData.active_sessions}</p>
              <p className="text-sm text-gray-600">Active Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{realTimeData.hourly_pageviews}</p>
              <p className="text-sm text-gray-600">Pageviews (Last Hour)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{realTimeData.pageviews_per_minute}</p>
              <p className="text-sm text-gray-600">Pageviews/Minute</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Last updated: {new Date(realTimeData.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};