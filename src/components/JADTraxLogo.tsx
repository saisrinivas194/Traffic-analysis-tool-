import React from 'react';

interface JADTraxLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const JADTraxLogo: React.FC<JADTraxLogoProps> = ({ 
  className = "", 
  width = 40, 
  height = 40 
}) => {
  return (
    <img
      src="/jadtrax-logo.png"
      alt="JADTrax Logo"
      width={width}
      height={height}
      className={className}
      style={{
        objectFit: 'contain',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

export default JADTraxLogo;
