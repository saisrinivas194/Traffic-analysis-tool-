import React, { useState } from 'react';
import { Activity, Shield, ShieldAlert, Search, AlertCircle } from 'lucide-react';
import { TrafficChart } from './components/TrafficChart';
import { TrafficTable } from './components/TrafficTable';
import { useTrafficData } from './hooks/useTrafficData';

function App() {
  const [url, setUrl] = useState<string>('');
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const { trafficData, chartData, isLoading, error, isServerConnected } = useTrafficData(activeUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      // Ensure URL has protocol
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      setActiveUrl(formattedUrl);
    }
  };

  const httpsPercentage = trafficData.length
    ? Math.round(
        (trafficData.filter((entry) => entry.protocol === 'HTTPS').length / trafficData.length) * 100
      )
    : 0;

  const avgResponseTime = trafficData.length
    ? Math.round(trafficData.reduce((acc, curr) => acc + curr.responseTime, 0) / trafficData.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            <h1 className="text-xl font-bold">Traffic Analyzer</h1>
          </div>
          {!isServerConnected && (
            <div className="flex items-center text-red-300">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Server disconnected</span>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isServerConnected}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !isServerConnected}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
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

        {activeUrl && isServerConnected && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">HTTPS Usage</h3>
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold mt-2">{httpsPercentage}%</p>
                <p className="text-sm text-gray-500">of total traffic</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Avg Response Time</h3>
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold mt-2">{avgResponseTime}ms</p>
                <p className="text-sm text-gray-500">across all requests</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Security Alerts</h3>
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {trafficData.filter((entry) => entry.protocol === 'HTTP').length}
                </p>
                <p className="text-sm text-gray-500">insecure connections</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Traffic Overview</h2>
              <TrafficChart data={chartData} />
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Recent Requests</h2>
              </div>
              <TrafficTable entries={trafficData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;