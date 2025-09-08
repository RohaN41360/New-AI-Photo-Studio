import React, { useState } from 'react';
import type { UploadedImage, GenerationMode } from '../types';
import { BriefcaseIcon, FaceSmileIcon, PencilIcon } from './Icons';

interface GenerationOptionsProps {
  image: UploadedImage;
  onGenerate: (mode: GenerationMode, customPrompt?: string) => void;
  onStartOver: () => void;
}

const GenerationOptions: React.FC<GenerationOptionsProps> = ({ image, onGenerate, onStartOver }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onGenerate('custom', customPrompt);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start animate-fade-in">
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-200 self-start">Your Photo</h2>
        <div className="aspect-w-1 aspect-h-1 w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-800/50 ring-1 ring-white/10">
          <img src={image.dataUrl} alt="Uploaded" className="object-contain w-full h-full" />
        </div>
        <button
            onClick={onStartOver}
            className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Use a different photo
        </button>
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">Choose a Style</h2>
        <div className="space-y-4">
          <OptionCard
            icon={<BriefcaseIcon className="w-8 h-8 text-indigo-400" />}
            title="Generate Professional Poses"
            description="Create 5 polished headshots with business attire and clean corporate backgrounds."
            onClick={() => onGenerate('professional')}
          />
          <OptionCard
            icon={<FaceSmileIcon className="w-8 h-8 text-indigo-400" />}
            title="Generate Creative Poses"
            description="Create 5 varied, fun poses with new expressions, keeping your original clothing."
            onClick={() => onGenerate('creative')}
          />
          <div>
            <form onSubmit={handleCustomSubmit} className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 transition-shadow hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col sm:flex-row gap-4 items-start">
              <div className="shrink-0 text-indigo-400 pt-1">
                <PencilIcon className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white">Custom Instructions</h3>
                <p className="text-sm text-gray-400 mt-1 mb-4">Enter your own prompt to generate a custom image.</p>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., add a superhero cape"
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={!customPrompt.trim()}
                  className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all transform hover:scale-105 disabled:scale-100"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OptionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-6 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500 hover:bg-gray-800/80 transition-all transform hover:-translate-y-1 duration-300 ease-in-out shadow-lg hover:shadow-indigo-500/10 flex items-start gap-4"
    >
      <div className="shrink-0 pt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </button>
)

export default GenerationOptions;