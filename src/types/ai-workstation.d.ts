// AI工作台组件相关的类型定义

export interface UploadedImage {
  id: string;
  src: string;
  isUrl: boolean;
  blobUrl?: boolean;
}

export interface GeneratedResult {
  id: string;
  url: string;
  originalPrompt: string;
  model: string;
  aspectRatio: string;
  generatedAt: string;
  seed: number;
  steps: number;
}

export interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  split: number;
  onSplitChange: (split: number) => void;
  height?: number;
}

export interface UploaderProps {
  images: UploadedImage[];
  onAddFiles: (files: File[]) => void;
  onAddUrl: () => void;
  onClearAll: () => void;
  onRemoveImage?: (index: number) => void;
  isLoadingUrl: boolean;
  showUrl: boolean;
  setShowUrl: (show: boolean) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onApplyTemplate?: (template: string) => void;
}

export interface ResultGridProps {
  results: GeneratedResult[];
  onDownload: (url: string, filename: string) => void;
}

export interface GenerationStage {
  progress: number;
  stage: string;
  duration: number;
}

export type AspectRatio = "Match Input" | "2:3" | "16:9" | "1:1" | "9:16";
export type ModelType = "Pro" | "Max";

// 模板类型
export interface PromptTemplate {
  restoreImage: string;
  changeHaircut: string;
  portraitSeries: string;
  removeBackground: string;
}

// 生成参数
export interface GenerationParams {
  prompt: string;
  images: UploadedImage[];
  model: ModelType;
  aspectRatio: AspectRatio;
  imageCount: number;
  watermark: boolean;
}

// 生成状态
export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  stage: string;
  elapsedTime: number;
  results: GeneratedResult[];
  showResults: boolean;
}

// AI工作站图片数据库记录
export interface AIWorkstationImage {
  id: number;
  uuid: string;
  created_at?: Date | string;
  img_url?: string;
  img_description?: string;
  status?: string;
  user_uuid?: string;
  prompt?: string;
  model?: string;
  aspect_ratio?: string;
  watermark: boolean;
  credits: number;
  credits_used: number;
  credits_remaining: number;
}