"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { VivecruitTextLoader } from './vivecruit-loader';

const AdvancedPageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading ViveCruit...");
  const pathname = usePathname();

  useEffect(() => {
    // Set loading message based on current page
    const getLoadingMessage = () => {
      if (pathname.includes('/dashboard')) {
        return "Loading Dashboard...";
      } else if (pathname.includes('/all-interviews')) {
        return "Loading Interviews...";
      } else if (pathname.includes('/profile')) {
        return "Loading Profile...";
      } else if (pathname.includes('/create-interview')) {
        return "Loading Interview Creator...";
      } else if (pathname.includes('/interview/') && pathname.includes('/start')) {
        return "Initializing Interview...";
      } else if (pathname.includes('/interview/') && !pathname.includes('/start')) {
        return "Loading Interview...";
      } else if (pathname.includes('/auth')) {
        return "Loading Authentication...";
      } else if (pathname.includes('/settings')) {
        return "Loading Settings...";
      } else if (pathname.includes('/billing')) {
        return "Loading Billing...";
      } else {
        return "Loading ViveCruit...";
      }
    };

    setLoadingMessage(getLoadingMessage());
    setIsLoading(true);

    // Show loader for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <VivecruitTextLoader 
          size="large" 
          text={loadingMessage} 
          showSubtitle={true} 
        />
      </div>
    );
  }

  return children;
};

export default AdvancedPageLoader;
