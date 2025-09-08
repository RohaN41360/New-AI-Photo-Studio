
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

const LoadingScreen: React.FC = () => {
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = LOADING_MESSAGES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
        return LOADING_MESSAGES[nextIndex];
      });
    }, 2500);

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                return 95;
            }
            // Simulate slower progress as it gets closer to the end
            const increment = Math.random() * (100 - prev > 20 ? 3 : 1);
            return Math.min(prev + increment, 95);
        });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-700 rounded-full animate-spin mx-auto"></div>
        <h2 className="text-2xl font-bold mt-8 text-white">Generating Your Images...</h2>
        <p className="text-gray-400 mt-2 transition-opacity duration-500">{message}</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-8 overflow-hidden">
          <div
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
