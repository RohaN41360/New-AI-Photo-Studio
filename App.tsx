import React, { useState, useCallback } from 'react';
import UploadArea from './components/UploadArea';
import GenerationOptions from './components/GenerationOptions';
import LoadingScreen from './components/LoadingScreen';
import ResultsDisplay from './components/ResultsDisplay';
import { SparklesIcon, PhotoIcon, MagicWandIcon, DownloadIcon } from './components/Icons';
import type { AppStep, UploadedImage, GenerationMode } from './types';
import { generatePrompts, editImage } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((image: UploadedImage) => {
    setUploadedImage(image);
    setStep('options');
  }, []);

  const handleGeneration = useCallback(async (mode: GenerationMode, customPrompt?: string) => {
    if (!uploadedImage) return;

    setStep('loading');
    setError(null);
    setGeneratedImages([]);

    try {
      let images: string[] = [];
      if (mode === 'custom' && customPrompt) {
        const result = await editImage(uploadedImage, customPrompt);
        images = [result];
      } else if (mode === 'professional' || mode === 'creative') {
        const prompts = await generatePrompts(mode);
        const imagePromises = prompts.slice(0, 5).map(prompt => editImage(uploadedImage, prompt));
        images = await Promise.all(imagePromises);
      }
      
      const validImages = images.filter(img => img);
      if (validImages.length === 0) {
        throw new Error('AI failed to generate any images. This might be a safety block. Please try a different photo or prompt.');
      }

      setGeneratedImages(validImages);
      setStep('results');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating images. Please try again.';
      setError(errorMessage);
      setStep('options'); // Go back to options on error
    }
  }, [uploadedImage]);
  
  const handleStartOver = () => {
    setStep('upload');
    setUploadedImage(null);
    setGeneratedImages([]);
    setError(null);
  }

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4">
            <div className="w-full grid md:grid-cols-3 gap-6 text-center my-8 md:my-12">
              <InfoCard
                icon={<PhotoIcon className="w-8 h-8 text-indigo-400" />}
                title="1. Upload Photo"
                description="Start with any portrait or selfie. A clear, well-lit photo works best."
              />
              <InfoCard
                icon={<MagicWandIcon className="w-8 h-8 text-indigo-400" />}
                title="2. Generate"
                description="Choose a style or write a custom prompt to transform your image with AI."
              />
              <InfoCard
                icon={<DownloadIcon className="w-8 h-8 text-indigo-400" />}
                title="3. Download"
                description="Save your favorite AI-generated creations in high resolution."
              />
            </div>
            <UploadArea onImageUpload={handleImageUpload} />
          </div>
        );
      case 'options':
        if (!uploadedImage) {
            handleStartOver(); // Should not happen, but as a fallback
            return null;
        }
        return (
            <>
                {error && <div className="w-full max-w-5xl mx-auto p-4 mb-4 text-center bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}
                <GenerationOptions image={uploadedImage} onGenerate={handleGeneration} onStartOver={handleStartOver} />
            </>
        );
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        if (!uploadedImage || generatedImages.length === 0) {
            handleStartOver(); // Should not happen, but as a fallback
            return null;
        }
        return <ResultsDisplay originalImage={uploadedImage} generatedImages={generatedImages} onStartOver={handleStartOver} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4">
        <header className="w-full max-w-7xl mx-auto text-center py-8 md:py-12">
            <div className="flex items-center justify-center gap-3">
                <SparklesIcon className="w-10 h-10 text-indigo-400"/>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                    AI Photo Studio
                </h1>
            </div>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Transform your photos into professional headshots, creative portraits, and more.
            </p>
        </header>
        <main className="w-full flex-grow flex items-center justify-center">
            {renderStep()}
        </main>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-2xl">
    <div className="mb-3">{icon}</div>
    <h3 className="font-bold text-lg text-white">{title}</h3>
    <p className="text-sm text-gray-400 mt-1">{description}</p>
  </div>
);

export default App;