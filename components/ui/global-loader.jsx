import React from 'react';
import { VivecruitLoader, VivecruitTextLoader } from './vivecruit-loader';

const GlobalLoader = ({ 
  message = "Loading...", 
  size = "large",
  showLogo = true,
  useTextLogo = true,
  className = "" 
}) => {
  return (
    <div className={`fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 ${className}`}>
      <div className="text-center">
        {showLogo && useTextLogo ? (
          <VivecruitTextLoader size={size} text={message} showSubtitle={true} />
        ) : showLogo ? (
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="ViveCruit" 
              className="w-32 h-auto mx-auto mb-4"
            />
            <VivecruitLoader size={size} text={message} />
          </div>
        ) : (
          <VivecruitLoader size={size} text={message} />
        )}
      </div>
    </div>
  );
};

// Page loading component
const PageLoader = ({ message = "Loading page...", size = "default", useTextLogo = true }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {useTextLogo ? (
        <VivecruitTextLoader size={size} text={message} showSubtitle={true} />
      ) : (
        <VivecruitLoader size={size} text={message} />
      )}
    </div>
  );
};

// Section loading component
const SectionLoader = ({ message = "Loading...", size = "default", useTextLogo = false }) => {
  return (
    <div className="flex items-center justify-center py-12">
      {useTextLogo ? (
        <VivecruitTextLoader size={size} text={message} showSubtitle={false} />
      ) : (
        <VivecruitLoader size={size} text={message} />
      )}
    </div>
  );
};

// Inline loading component
const InlineLoader = ({ message = "Loading", useTextLogo = false }) => {
  return (
    <div className="flex items-center justify-center py-4">
      {useTextLogo ? (
        <VivecruitTextLoader size="small" text={message} showSubtitle={false} />
      ) : (
        <VivecruitLoader size="small" text={message} />
      )}
    </div>
  );
};

export { GlobalLoader, PageLoader, SectionLoader, InlineLoader };
