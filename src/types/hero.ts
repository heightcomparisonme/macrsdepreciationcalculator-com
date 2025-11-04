// Hero组件相关的类型定义

export type HeroMode = 'one' | 'two' | 'three';

export type AspectRatio = '1:1' | '2:3' | '16:9';

export interface ImageUploadState {
  uploadedImages: File[];
  prompt: string;
  aspectRatio: AspectRatio;
  outputCount: number;
}

export interface HeroSwitcherState {
  mode: HeroMode;
  panelState: ImageUploadState;
}

// 组件Props接口
export interface ComponentOneProps {
  onSwitchToTwo: () => void;
  onSwitchToThree?: () => void;
  title?: string;
  description?: string;
  subdescription?: string;
  buttonText?: string;
  className?: string;
}

export interface ControlPanelProps {
  state: ImageUploadState;
  onChange: (state: ImageUploadState) => void;
  onBackToOne?: () => void;
  currentMode: HeroMode;
  className?: string;
  maxImages?: number;
  maxPromptLength?: number;
  showBackButton?: boolean;
}

export interface PreviewCarouselProps {
  images?: Array<{
    id: string | number;
    src: string;
    alt: string;
    title?: string;
  }>;
  className?: string;
  showControls?: boolean;
  autoSlide?: boolean;
  slideInterval?: number;
}

export interface HeroSectionProps {
  initialMode?: HeroMode;
  initialPanelState?: Partial<ImageUploadState>;
  onModeChange?: (mode: HeroMode) => void;
  className?: string;
  animationDuration?: number;
  // 组件自定义
  ComponentOne?: React.ComponentType<ComponentOneProps>;
  ControlPanel?: React.ComponentType<ControlPanelProps>;
  PreviewCarousel?: React.ComponentType<PreviewCarouselProps>;
  // 可选：第三种模式左侧组件（默认使用 ComponentTwo）
  ComponentTwo?: React.ComponentType<any>;
}

// Animation配置
export interface AnimationConfig {
  duration: number;
  ease: string | number[];
  initial: { opacity: number; x: number };
  animate: { opacity: number; x: number };
  exit: { opacity: number; x: number };
}
