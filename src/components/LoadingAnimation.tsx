
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-ats-primary rounded-full animate-loading-dots" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-ats-primary rounded-full animate-loading-dots" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-ats-primary rounded-full animate-loading-dots" style={{ animationDelay: '0.4s' }}></div>
      <div className="ml-4 text-ats-text font-medium">Analyzing...</div>
    </div>
  );
};

export default LoadingAnimation;
