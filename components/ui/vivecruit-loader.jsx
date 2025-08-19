import React from 'react';

const VivecruitLoader = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12", 
    large: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const textSizes = {
    small: "text-xs",
    default: "text-sm",
    large: "text-base",
    xl: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Main Loader */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer Ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-gray-200 ${sizeClasses[size]}`}></div>
        
        {/* Animated Ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-violet-600 border-r-violet-500 animate-spin ${sizeClasses[size]}`}></div>
        
        {/* Inner Circle with V */}
        <div className={`absolute inset-1 rounded-full bg-white flex items-center justify-center ${sizeClasses[size.replace('w-', 'w-').replace('h-', 'h-')]}`}>
          <div className="text-violet-600 font-bold text-center leading-none">
            <span className="text-xs">V</span>
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      {text && (
        <div className={`text-gray-600 font-medium ${textSizes[size]} text-center`}>
          {text}
        </div>
      )}
    </div>
  );
};

// Professional animated text logo loader
const VivecruitTextLoader = ({ size = "default", text = "Loading...", showSubtitle = true }) => {
  const sizeClasses = {
    small: "text-2xl",
    default: "text-3xl",
    large: "text-4xl",
    xl: "text-5xl"
  };

  const subtitleSizes = {
    small: "text-xs",
    default: "text-sm",
    large: "text-base",
    xl: "text-lg"
  };

  const letters = "ViveCruit".split('');

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Animated Text Logo */}
      <div className="flex items-center justify-center">
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`font-bold text-violet-600 ${sizeClasses[size]} animate-bounce`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.5s',
              animationIterationCount: 'infinite'
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Animated Underline */}
      <div className="relative">
        <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-pulse" 
             style={{ width: '120px' }}></div>
        <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full animate-ping opacity-30"></div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className={`text-gray-600 font-medium ${subtitleSizes[size]} text-center animate-pulse`}>
          {text}
        </div>
      )}

      {/* Subtitle */}
      {showSubtitle && (
        <div className={`text-gray-400 ${subtitleSizes[size]} text-center font-light`}>
          AI-Powered Interview Platform
        </div>
      )}
    </div>
  );
};

// Pulse variant for different loading states
const VivecruitPulse = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const textSizes = {
    small: "text-xs",
    default: "text-sm", 
    large: "text-base",
    xl: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Pulsing V Logo */}
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 rounded-full bg-violet-600 animate-ping opacity-75 ${sizeClasses[size]}`}></div>
        <div className={`relative rounded-full bg-violet-600 flex items-center justify-center ${sizeClasses[size]}`}>
          <span className="text-white font-bold text-center leading-none">
            <span className="text-xs">V</span>
          </span>
        </div>
      </div>
      
      {/* Loading Text */}
      {text && (
        <div className={`text-gray-600 font-medium ${textSizes[size]} text-center`}>
          {text}
        </div>
      )}
    </div>
  );
};

// Dots variant for inline loading
const VivecruitDots = ({ text = "Loading" }) => {
  return (
    <div className="flex items-center space-x-1">
      <span className="text-gray-600">{text}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

// Spinner variant for buttons and small elements
const VivecruitSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-violet-600 ${sizeClasses[size]}`}></div>
  );
};

export { VivecruitLoader, VivecruitTextLoader, VivecruitPulse, VivecruitDots, VivecruitSpinner };
