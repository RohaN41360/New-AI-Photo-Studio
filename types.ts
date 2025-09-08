
export type AppStep = 'upload' | 'options' | 'loading' | 'results';

export type GenerationMode = 'professional' | 'creative' | 'custom';

export interface UploadedImage {
  dataUrl: string;
  mimeType: string;
  width: number;
  height: number;
}
