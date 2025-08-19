"use client";
import React, { useState, useEffect } from 'react';
import { VivecruitTextLoader } from './vivecruit-loader';

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <VivecruitTextLoader 
          size="large" 
          text="Loading ViveCruit..." 
          showSubtitle={true} 
        />
      </div>
    );
  }

  return children;
};

export default PageLoader;
