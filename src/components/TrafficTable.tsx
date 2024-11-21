import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface TrafficEntry {
  id: string;
  domain: string;
  protocol: 'HTTP' | 'HTTPS';
  requestCount: number;
  responseTime: number;
  status: number;
  timestamp: string;
}

interface TrafficTableProps {
  entries: TrafficEntry[];
}

export const TrafficTable: React.FC<TrafficTableProps> = ({ entries }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Domain</th>
            <th className="px-6 py-3 text-left">Protocol</th>
            <th className="px-6 py-3 text-left">Requests</th>
            <th className="px-6 py-3 text-left">Response Time</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{entry.domain}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.protocol === 'HTTPS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {entry.protocol}
                </span>
              </td>
              <td className="px-6 py-4">{entry.requestCount}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {entry.responseTime}ms
                  {entry.responseTime > 200 ? (
                    <ArrowUp className="w-4 h-4 text-red-500 ml-2" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-green-500 ml-2" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.status < 400
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {entry.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};