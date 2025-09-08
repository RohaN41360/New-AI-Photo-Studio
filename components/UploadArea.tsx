import React, { useState, useCallback, useRef } from 'react';
import type { UploadedImage } from '../types';
import { UploadIcon } from './Icons';

interface UploadAreaProps {
  onImageUpload: (image: UploadedImage) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          onImageUpload({
            dataUrl,
            mimeType: file.type,
            width: img.width,
            height: img.height,
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  }, [onImageUpload]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const ringClasses = 'ring-2 ring-offset-4 ring-offset-gray-900 ring-indigo-500';

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowseClick}
      className={`relative w-full h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-300 group ${isDragging ? `border-indigo-400 bg-gray-800/50 scale-105 ${ringClasses}` : 'border-gray-600 hover:border-indigo-500 hover:bg-gray-800/50'}`}
      role="button"
      tabIndex={0}
      aria-label="Image upload area"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onBrowseClick()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept="image/*,image/heic,image/heif"
        className="hidden"
      />
      <div className="absolute inset-0 bg-gray-800/10 rounded-2xl group-hover:bg-gray-800/50 transition-colors duration-300"></div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <UploadIcon className="w-16 h-16 text-gray-500 mb-4 transform group-hover:scale-110 transition-transform duration-300" />
        <p className="text-xl font-semibold text-gray-300">Drag & drop your photo here</p>
        <p className="text-gray-400 mt-2">or</p>
        <div className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md group-hover:bg-indigo-500 transition-all duration-300 transform group-hover:scale-105">
          Browse Files
        </div>
      </div>
    </div>
  );
};

export default UploadArea;