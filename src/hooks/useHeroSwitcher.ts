'use client';

import { useState, useCallback } from 'react';
import { HeroMode, ImageUploadState, HeroSwitcherState } from '@/types/hero';

interface UseHeroSwitcherOptions {
  initialMode?: HeroMode;
  initialPanelState?: Partial<ImageUploadState>;
  onModeChange?: (mode: HeroMode) => void;
}

const defaultPanelState: ImageUploadState = {
  uploadedImages: [],
  prompt: '',
  aspectRatio: '1:1',
  outputCount: 2,
};

export function useHeroSwitcher(options: UseHeroSwitcherOptions = {}) {
  const {
    initialMode = 'one',
    initialPanelState = {},
    onModeChange,
  } = options;

  const [mode, setMode] = useState<HeroMode>(initialMode);
  const [panelState, setPanelState] = useState<ImageUploadState>({
    ...defaultPanelState,
    ...initialPanelState,
  });

  const switchToTwo = useCallback(() => {
    setMode('two');
    onModeChange?.('two');
  }, [onModeChange]);

  const switchToThree = useCallback(() => {
    setMode('three');
    onModeChange?.('three');
  }, [onModeChange]);

  const switchToOne = useCallback(() => {
    setMode('one');
    onModeChange?.('one');
  }, [onModeChange]);

  const toggleMode = useCallback(() => {
    const order: HeroMode[] = ['one', 'two', 'three'];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    onModeChange?.(next);
  }, [mode, onModeChange]);

  const updatePanelState = useCallback((newState: ImageUploadState) => {
    setPanelState(newState);
  }, []);

  // 图片上传相关方法
  const addImages = useCallback((newImages: File[]) => {
    setPanelState(prev => ({
      ...prev,
      uploadedImages: [...prev.uploadedImages, ...newImages],
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setPanelState(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
    }));
  }, []);

  const updatePrompt = useCallback((prompt: string) => {
    setPanelState(prev => ({ ...prev, prompt }));
  }, []);

  const updateAspectRatio = useCallback((aspectRatio: ImageUploadState['aspectRatio']) => {
    setPanelState(prev => ({ ...prev, aspectRatio }));
  }, []);

  const updateOutputCount = useCallback((outputCount: number) => {
    setPanelState(prev => ({ ...prev, outputCount }));
  }, []);

  const resetPanelState = useCallback(() => {
    setPanelState(defaultPanelState);
  }, []);

  return {
    // 状态
    mode,
    panelState,

    // 模式切换方法
    switchToOne,
    switchToTwo,
    switchToThree,
    toggleMode,

    // 面板状态管理
    updatePanelState,
    addImages,
    removeImage,
    updatePrompt,
    updateAspectRatio,
    updateOutputCount,
    resetPanelState,

    // 计算属性
    isHeroOne: mode === 'one',
    isHeroTwo: mode === 'two',
    hasImages: panelState.uploadedImages.length > 0,
    canGenerate: panelState.prompt.trim().length > 0,
    isHeroThree: mode === 'three',
  };
}
