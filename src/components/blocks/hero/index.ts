// Hero组件统一导出
export { default as HeroSection, HeroSectionPresets } from './HeroSection';
export { default as ComponentOne, ComponentOneVariants } from './ComponentOne';
export { default as ControlPanel } from './ControlPanel';
export { default as PreviewCarousel, CPMDataSelectorConfigs } from './PreviewCarousel';

// 导出hooks
export { useHeroSwitcher } from '@/hooks/useHeroSwitcher';

// 导出类型
export type {
  HeroMode,
  AspectRatio,
  ImageUploadState,
  HeroSwitcherState,
  ComponentOneProps,
  ControlPanelProps,
  PreviewCarouselProps,
  HeroSectionProps,
  AnimationConfig,
} from '@/types/hero';
