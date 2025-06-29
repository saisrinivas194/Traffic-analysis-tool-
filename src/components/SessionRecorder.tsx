import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, MousePointer, Eye, Zap, User } from 'lucide-react';

interface SessionEvent {
  id: string;
  timestamp: number;
  event_type: 'click' | 'scroll' | 'hover' | 'pageview' | 'form_submit';
  x?: number;
  y?: number;
  element?: string;
  page_url: string;
  data?: Record<string, unknown>;
}

interface SessionRecording {
  id: string;
  session_id: string;
  start_time: string;
  duration: number;
  events: SessionEvent[];
  user_agent: string;
  device_type: string;
  location: string;
}

interface SessionRecorderProps {
  sessionRecording: SessionRecording | null;
  isLoading: boolean;
}

export const SessionRecorder: React.FC<SessionRecorderProps> = ({
  sessionRecording,
  isLoading
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    if (!sessionRecording || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + (100 * playbackSpeed);
        if (newTime >= sessionRecording.duration) {
          setIsPlaying(false);
          setCurrentTime(0);
          setCurrentEventIndex(0);
          return 0;
        }
        
        // Find current event based on time
        const eventIndex = sessionRecording.events.findIndex(event => 
          event.timestamp >= newTime
        );
        if (eventIndex !== -1) {
          setCurrentEventIndex(eventIndex);
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [sessionRecording, isPlaying, playbackSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    const eventIndex = sessionRecording?.events.findIndex(event => 
      event.timestamp >= time
    ) ?? 0;
    setCurrentEventIndex(Math.max(0, eventIndex));
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (!sessionRecording) return;
    
    const skipTime = direction === 'forward' ? 5000 : -5000;
    const newTime = Math.max(0, Math.min(sessionRecording.duration, currentTime + skipTime));
    handleSeek(newTime);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'click': return <MousePointer className="w-4 h-4 text-red-500" />;
      case 'scroll': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'hover': return <Zap className="w-4 h-4 text-green-500" />;
      case 'pageview': return <User className="w-4 h-4 text-purple-500" />;
      default: return <MousePointer className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventDescription = (event: SessionEvent) => {
    switch (event.event_type) {
      case 'click':
        return `Clicked on ${event.element || 'element'} at (${event.x}, ${event.y})`;
      case 'scroll':
        return `Scrolled to position (${event.x}, ${event.y})`;
      case 'hover':
        return `Hovered over ${event.element || 'element'}`;
      case 'pageview':
        return `Viewed page: ${event.page_url}`;
      case 'form_submit':
        return `Submitted form on ${event.page_url}`;
      default:
        return `Performed ${event.event_type} action`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sessionRecording) {
    return (
      <div className="text-center py-8 text-gray-500">
        No session recording available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Session Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Session Recording</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Session ID:</span>
            <p className="font-mono text-xs">{sessionRecording.session_id}</p>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <p>{formatTime(sessionRecording.duration)}</p>
          </div>
          <div>
            <span className="text-gray-600">Device:</span>
            <p>{sessionRecording.device_type}</p>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>
            <p>{sessionRecording.location}</p>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => handleSkip('backward')}
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              aria-label="Skip backward 5 seconds"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleSkip('forward')}
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              aria-label="Skip forward 5 seconds"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(sessionRecording.duration)}
              </span>
            </div>
            
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max={sessionRecording.duration}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Session timeline"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0:00</span>
            <span>{formatTime(sessionRecording.duration)}</span>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3">Event Timeline</h4>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {sessionRecording.events.map((event, index) => (
            <div
              key={event.id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                index === currentEventIndex ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => handleSeek(event.timestamp)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getEventIcon(event.event_type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {getEventDescription(event)}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(event.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Events</p>
              <p className="text-2xl font-bold text-blue-900">{sessionRecording.events.length}</p>
            </div>
            <MousePointer className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Pages Viewed</p>
              <p className="text-2xl font-bold text-green-900">
                {new Set(sessionRecording.events.filter(e => e.event_type === 'pageview').map(e => e.page_url)).size}
              </p>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Click Events</p>
              <p className="text-2xl font-bold text-purple-900">
                {sessionRecording.events.filter(e => e.event_type === 'click').length}
              </p>
            </div>
            <MousePointer className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Time/Event</p>
              <p className="text-2xl font-bold text-orange-900">
                {sessionRecording.events.length > 0 
                  ? Math.round(sessionRecording.duration / sessionRecording.events.length / 1000)
                  : 0}s
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Session Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Session Insights</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• User spent {formatTime(sessionRecording.duration)} on this session</p>
          <p>• Most active period: {formatTime(sessionRecording.duration / 2)} into the session</p>
          <p>• Primary interaction type: {sessionRecording.events[0]?.event_type || 'Unknown'}</p>
          <p>• Session shows {sessionRecording.events.filter(e => e.event_type === 'click').length > 5 ? 'high' : 'moderate'} engagement</p>
        </div>
      </div>
    </div>
  );
}; 