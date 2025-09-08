import React, { useState } from 'react';
import type { UploadedImage } from '../types';
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ResultsDisplayProps {
  originalImage: UploadedImage;
  generatedImages: string[];
  onStartOver: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalImage, generatedImages, onStartOver }) => {
  const allImages = [originalImage.dataUrl, ...generatedImages];
  const [selectedIndex, setSelectedIndex] = useState(generatedImages.length > 0 ? 1 : 0); // Default to the first generated image if available

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = allImages[selectedIndex];
    const fileName = selectedIndex === 0 ? 'original_image.png' : `generated_image_${selectedIndex}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedImageUrl = allImages[selectedIndex];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Your Results</h2>
        <p className="text-gray-400 mt-2">Click on a thumbnail to view it. Download your favorite!</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Image Viewer */}
        <div className="lg:col-span-2 relative flex flex-col items-center justify-center bg-gray-900/50 rounded-2xl p-4 shadow-2xl aspect-[4/3]">
          {selectedImageUrl ? (
            <img src={selectedImageUrl} alt={`Result ${selectedIndex}`} className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg" />
          ) : (
            <div className="text-gray-500">No image to display</div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
                onClick={handleDownload}
                className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                aria-label="Download image"
            >
                <DownloadIcon className="w-6 h-6" />
            </button>
          </div>
          {allImages.length > 1 && (
            <>
              <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Variations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {allImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-indigo-500 ${selectedIndex === index ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent hover:ring-indigo-400'}`}
                role="button"
                tabIndex={0}
                aria-label={index === 0 ? 'Select original image' : `Select variation ${index}`}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedIndex(index)}
              >
                <img src={img} alt={index === 0 ? 'Original' : `Variation ${index}`} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 font-semibold">ORIGINAL</div>
                )}
                <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${selectedIndex === index ? 'opacity-0' : 'opacity-10 group-hover:opacity-0'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <button
            onClick={onStartOver}
            className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all transform hover:scale-105"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
