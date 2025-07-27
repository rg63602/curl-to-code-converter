import React, { useState, useEffect } from 'react';
import { FUNKY_LOADING_MESSAGES, CONFIG } from '../constants';

export const Spinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Set an initial random index so the sequence doesn't always start from the same message
    const initialIndex = Math.floor(Math.random() * FUNKY_LOADING_MESSAGES.length);
    setMessageIndex(initialIndex);

    const interval = setInterval(() => {
      // Use functional update to avoid dependency on messageIndex
      setMessageIndex(prevIndex => (prevIndex + 1) % FUNKY_LOADING_MESSAGES.length);
    }, CONFIG.FUNKY_LOADER_INTERVAL); // This duration must match the CSS animation duration

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
      {/* The key is crucial. It tells React to create a new element, which re-triggers the CSS animation */}
      <p key={messageIndex} className="text-xl text-center font-medium text-sky-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-sky-400 dark:to-emerald-400 animate-fade-in-out">
        {FUNKY_LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
};