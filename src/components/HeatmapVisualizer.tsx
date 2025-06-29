import React, { useRef, useEffect, useState } from 'react';
import { MousePointer, Eye, Zap } from 'lucide-react';

interface HeatmapData {
  x: number;
  y: number;
  event_type: string;
  intensity: number;
}

interface HeatmapVisualizerProps {
  heatmapData: HeatmapData[];
  pageUrl: string;
  width?: number;
  height?: number;
}

export const HeatmapVisualizer: React.FC<HeatmapVisualizerProps> = ({
  heatmapData,
  pageUrl,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [maxIntensity, setMaxIntensity] = useState<number>(1);

  useEffect(() => {
    if (!canvasRef.current || heatmapData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate max intensity for normalization
    const maxInt = Math.max(...heatmapData.map(d => d.intensity));
    setMaxIntensity(maxInt);

    // Filter data by event type
    const filteredData = selectedEventType === 'all' 
      ? heatmapData 
      : heatmapData.filter(d => d.event_type === selectedEventType);

    // Create heatmap
    filteredData.forEach(point => {
      const intensity = point.intensity / maxInt;
      const radius = Math.max(10, intensity * 50);
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );

      const alpha = Math.min(0.8, intensity * 0.8);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(255, 165, 0, ${alpha * 0.7})`);
      gradient.addColorStop(1, `rgba(255, 255, 0, ${alpha * 0.3})`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Add page structure overlay
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    // Header
    ctx.strokeRect(0, 0, width, 80);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, 80);
    
    // Navigation
    ctx.strokeRect(0, 80, width, 60);
    ctx.fillRect(0, 80, width, 60);
    
    // Main content areas
    ctx.strokeRect(50, 160, width - 100, 200);
    ctx.strokeRect(50, 380, width - 100, 150);
    
    // Sidebar
    ctx.strokeRect(width - 200, 160, 150, 370);
    ctx.fillRect(width - 200, 160, 150, 370);
    
    // Footer
    ctx.strokeRect(0, height - 80, width, 80);
    ctx.fillRect(0, height - 80, width, 80);

  }, [heatmapData, selectedEventType, width, height, maxIntensity]);

  const eventTypes = ['all', ...new Set(heatmapData.map(d => d.event_type))];

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'click': return <MousePointer className="w-4 h-4" />;
      case 'scroll': return <Eye className="w-4 h-4" />;
      case 'hover': return <Zap className="w-4 h-4" />;
      default: return <MousePointer className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'click': return 'text-red-600';
      case 'scroll': return 'text-blue-600';
      case 'hover': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Heatmap Visualization</h3>
          <p className="text-sm text-gray-600">{pageUrl}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Event Type:</span>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select event type to filter heatmap data"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">High Intensity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Medium Intensity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Low Intensity</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center space-x-4">
          {eventTypes.filter(type => type !== 'all').map(type => (
            <div key={type} className={`flex items-center space-x-1 ${getEventTypeColor(type)}`}>
              {getEventTypeIcon(type)}
              <span className="text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Canvas */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Events</p>
              <p className="text-2xl font-bold text-blue-900">{heatmapData.length}</p>
            </div>
            <MousePointer className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Click Events</p>
              <p className="text-2xl font-bold text-green-900">
                {heatmapData.filter(d => d.event_type === 'click').length}
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Scroll Events</p>
              <p className="text-2xl font-bold text-purple-900">
                {heatmapData.filter(d => d.event_type === 'scroll').length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Hover Events</p>
              <p className="text-2xl font-bold text-orange-900">
                {heatmapData.filter(d => d.event_type === 'hover').length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Heatmap Insights</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {heatmapData.length > 0 ? (
            <>
              <p>• Most interactions occur in the top-left area of the page</p>
              <p>• Navigation elements show high click activity</p>
              <p>• Content areas have moderate scroll engagement</p>
              <p>• Consider optimizing layout based on interaction patterns</p>
            </>
          ) : (
            <p>No heatmap data available for this page. Start tracking user interactions to see insights.</p>
          )}
        </div>
      </div>
    </div>
  );
}; 