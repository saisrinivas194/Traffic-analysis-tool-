import React from 'react';

interface VideoLoaderProps {
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  className?: string;
  overlay?: boolean;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ 
  size = 'medium', 
  className = '',
  overlay = false 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16';
      case 'medium':
        return 'w-24 h-24';
      case 'large':
        return 'w-32 h-32';
      case 'fullscreen':
        return 'w-full h-full';
      default:
        return 'w-24 h-24';
    }
  };

  const containerClasses = overlay 
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={`${getSizeClasses()} flex items-center justify-center`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain rounded-lg"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          <source src="/jadload.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </video>
      </div>
      

    </div>
  );
};

export default VideoLoader;
