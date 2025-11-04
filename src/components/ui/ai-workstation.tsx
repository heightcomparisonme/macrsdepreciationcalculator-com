"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import BeforeAfterSlider from "@/components/ui/before-after-slider";
import { cn } from "@/lib/utils";
import { Upload, X, Download, Image as ImageIcon } from "lucide-react";
import type {
  CompareSliderProps,
  UploaderProps,
  PromptControlsProps,
  ResultGridProps,
  UploadedImage,
  GeneratedResult,
  AspectRatio,
  ModelType,
  PromptTemplate
} from "@/types/ai-workstation";
import { AI_WORKSTATION_CONFIG } from "@/config/ai-workstation";

/**
 * FluxKontext-Workspace.jsx
 * 仅保留「左侧编辑工作区 + 右侧结果工作区」
 * - 提炼成更小的组件：Uploader、PromptControls、CompareSlider、ResultGrid
 * - 使用 Pointer Events 支持移动端拖拽
 * - 使用 URL.createObjectURL 优化本地图片预览并在清理时 revoke
 */

// 使用项目现有的 BeforeAfterSlider 组件
function CompareSlider({ beforeSrc, afterSrc, split, onSplitChange, height = 384 }: CompareSliderProps) {
  const t = useTranslations("pages.workstation.results");
  
  return (
    <div className="relative" style={{ height }}>
      <BeforeAfterSlider
        beforeImage={beforeSrc}
        afterImage={afterSrc}
        beforeAlt="Before"
        afterAlt="After"
        className="w-full h-full"
      />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
        {t("before_after_tip")}
      </div>
    </div>
  );
}

// 上传区域（拖拽、点击、URL 添加、缩略图）
function Uploader({ images, onAddFiles, onAddUrl, onClearAll, onRemoveImage, isLoadingUrl, showUrl, setShowUrl, imageUrl, setImageUrl }: UploaderProps & { onRemoveImage?: (index: number) => void }) {
  const [dragging, setDragging] = useState(false);
  const t = useTranslations("pages.workstation.image_upload");

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{t("title")}</label>
        {!showUrl ? (
        <Button variant="outline" size="sm" onClick={() => setShowUrl(true)}>{t("url_button")}</Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => { setShowUrl(false); setImageUrl(""); }}>{t("hide_url")}</Button>
        )}
      </div>

      {showUrl && (
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onAddUrl(); }}
              placeholder={t("url_placeholder")}
              className="flex-1"
              disabled={isLoadingUrl}
            />
            <Button
              onClick={onAddUrl}
              disabled={!imageUrl.trim() || isLoadingUrl}
              variant="outline"
              size="icon"
              title="Add URL"
            >
              {isLoadingUrl ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t("url_help")}</p>
        </div>
      )}

      {images.length > 0 ? (
        <div className="relative">
          {/* 主预览区域 - 合并成一个完整的区域 */}
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 bg-blue-50 relative hover:bg-blue-100 transition-all duration-200 group">
            <Button 
              onClick={onClearAll} 
              className="absolute top-3 right-3 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200" 
              variant="outline" 
              size="icon"
              aria-label="Clear all"
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* 图片预览 - 居中显示 */}
            <div className="flex justify-center mb-4">
              <img src={images[0].src} alt="Uploaded" className="max-h-48 rounded-lg shadow-sm" />
            </div>
            
            {/* URL标识 */}
            {images[0].isUrl && (
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                URL
              </div>
            )}
            
            {/* 图片信息 */}
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium mb-1">
                {images.length} {t("images_selected")}
              </p>
              <p className="text-xs text-blue-600">
                {t("file_types")} • {t("multiple_support")}
              </p>
            </div>
          </div>

          {/* 缩略图网格 */}
          <div className="mt-4">
            <div className="flex gap-3 flex-wrap justify-center">
              {images.map((img: UploadedImage, idx: number) => (
                <div key={img.id} className="relative group">
                  <div className="w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all duration-200">
                    <img src={img.src} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                  </div>
                  {/* 序号标识 */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                    {idx+1}
                  </div>
                  {/* URL标识 */}
                  {img.isUrl && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium shadow-sm">
                      U
                    </div>
                  )}
                  {/* 悬停时的操作按钮 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <Button 
                      onClick={() => onRemoveImage?.(idx)}
                      variant="destructive" 
                      size="icon"
                      className="w-8 h-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* 添加更多按钮 */}
              <label htmlFor="image-upload" className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-1 transition-colors duration-200" />
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-medium">
                  {t("add_more")}
                </span>
              </label>
            </div>
            
            {/* 清除所有按钮 */}
            <div className="flex justify-center mt-4">
              <Button 
                onClick={onClearAll} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                {t("clear_all")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer group",
            dragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
        >
          <div className={cn(
            "w-16 h-16 mx-auto mb-4 transition-colors duration-200",
            dragging ? "text-primary" : "text-gray-400 group-hover:text-blue-500"
          )}>
            <Upload className="w-full h-full" />
          </div>
          <p className={cn(
            "mb-2 transition-colors duration-200",
            dragging ? "text-primary font-medium" : "text-gray-700 group-hover:text-blue-600"
          )}>
            {dragging ? t("drop_here") : t("drag_drop")}
          </p>
          <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">{t("file_types")}</p>
          <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">{t("multiple_support")}</p>
        </label>
      )}

      <input id="image-upload" type="file" accept="image/*" multiple onChange={(e) => onAddFiles(e.target.files ? Array.from(e.target.files) : [])} className="hidden" />
    </div>
  );
}

function PromptControls({ prompt, setPrompt, onApplyTemplate }: PromptControlsProps) {
  const t = useTranslations("pages.workstation.prompt");
  
  const templates = useMemo((): PromptTemplate => ({
    restoreImage: "Restore the original appearance and quality of this image, fix any damage, enhance clarity and colors",
    changeHaircut: "Change the haircut style to a modern trendy look, maintain the face and other features unchanged",
    portraitSeries: "Create a professional portrait style with dramatic lighting and artistic composition",
    removeBackground: "Remove the background completely, make it transparent or pure white background",
  }), []);

  const add = (text: string): void => {
    if (!prompt.trim()) return setPrompt(text);
    const sep = prompt.endsWith(".") || prompt.endsWith("。") ? " " : ". ";
    setPrompt(prompt + sep + text);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-lg font-medium text-gray-900">{t("title")}</label>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:block">{t("translate")}</span>
          <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"/></div>
        </div>
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t("placeholder")}
        className="h-24 resize-none"
      />

      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        <Button onClick={() => add(templates.restoreImage)} variant="outline" size="sm" className="whitespace-nowrap">{t("templates.restore_image")}</Button>
        <Button onClick={() => add(templates.changeHaircut)} variant="outline" size="sm" className="whitespace-nowrap">{t("templates.change_haircut")}</Button>
        <Button onClick={() => add(templates.portraitSeries)} variant="outline" size="sm" className="whitespace-nowrap">{t("templates.portrait_series")}</Button>
        <Button onClick={() => add(templates.removeBackground)} variant="outline" size="sm" className="whitespace-nowrap">{t("templates.remove_background")}</Button>
      </div>
    </div>
  );
}

function ResultGrid({ results, onDownload }: ResultGridProps) {
  const t = useTranslations("pages.workstation.results");
  
  if (!results?.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((r: GeneratedResult, idx: number) => (
        <div key={r.id} className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col">
          <div className="relative mb-3">
            <img src={r.url} alt={`Result ${idx + 1}`} className="w-full h-64 object-cover rounded-lg border" />
            <Button 
              onClick={() => onDownload(r.url, `flux-kontext-result-${r.id}.jpg`)} 
              className="absolute top-2 right-2" 
              variant="secondary" 
              size="icon"
              title={t("download")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mb-1">{t("model_label")}: <span className="font-medium">{r.model}</span> | {t("aspect_label")}: <span className="font-medium">{r.aspectRatio}</span></div>
          <div className="text-xs text-gray-500 mb-1">{t("seed_label")}: <span className="font-mono">{r.seed}</span> | {t("steps_label")}: <span className="font-mono">{r.steps}</span></div>
          <div className="text-xs text-gray-500 mb-2">{t("generated_label")}: {new Date(r.generatedAt).toLocaleString()}</div>
          <div className="text-sm text-gray-700"><span className="font-medium">{t("prompt_label")}:</span> {r.originalPrompt}</div>
        </div>
      ))}
    </div>
  );
}

export default function FluxKontextWorkspace({
  initialCredits = 0,
  isPro = false,
  isRecharged = false,
}: {
  initialCredits?: number;
  isPro?: boolean;
  isRecharged?: boolean;
}) {
  const t = useTranslations("pages.workstation");
  // 左侧表单状态
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]); // {id, src, isUrl, blobUrl?}
  const [prompt, setPrompt] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<ModelType>("Pro");
  const [imageCount, setImageCount] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("Match Input");
  const [watermark, setWatermark] = useState<boolean>(true);

  // 用户积分状态 - 使用传入的初始值
  const [userCredits, setUserCredits] = useState<number>(initialCredits);
  const [creditsLoading, setCreditsLoading] = useState<boolean>(false);
  const [creditsError, setCreditsError] = useState<boolean>(initialCredits === -1);

  // URL 上传
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);

  // 右侧结果状态
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<string>("");
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // 当前生成的图片URL - 用于CompareSlider的afterImage
  const [currentGeneratedImage, setCurrentGeneratedImage] = useState<string>("");

  // 对比滑块
  const [split, setSplit] = useState<number>(50);
  
  // 防抖状态
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);

  // 计时器：仅在生成中递增
  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setElapsedTime((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isGenerating]);

  // 加载用户积分
  const fetchUserCredits = useCallback(async () => {
    try {
      setCreditsLoading(true);
      setCreditsError(false);
      const response = await fetch('/api/user/credits');
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits || 0);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to fetch user credits:', error);
      setCreditsError(true);
      setUserCredits(0);
    } finally {
      setCreditsLoading(false);
    }
  }, []);

  // 组件挂载时获取积分
  useEffect(() => {
    // 如果初始积分为0，则尝试获取积分
    if (initialCredits === 0) {
      fetchUserCredits();
    }
  }, [fetchUserCredits, initialCredits]);

  // 工具：格式化时间
  const formatTime = (seconds: number): string => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  // 处理文件添加（使用 objectURL，更省内存/更快）
  const addFiles = useCallback((files: File[]): void => {
    const list: UploadedImage[] = files.map((file: File) => ({ id: `${Date.now()}_${file.name}_${Math.random()}`, src: URL.createObjectURL(file), isUrl: false, blobUrl: true }));
    setUploadedImages((prev: UploadedImage[]) => [...prev, ...list]);
  }, []);

  const clearAllImages = useCallback((): void => {
    // 清理 objectURL
    uploadedImages.forEach((img: UploadedImage) => { 
      if (img.blobUrl) {
        URL.revokeObjectURL(img.src); 
        console.log("Revoked blob URL for image:", img.id);
      }
    });
    setUploadedImages([]);
  }, [uploadedImages]);

  // 删除单个图片
  const removeImage = useCallback((index: number): void => {
    const imageToRemove = uploadedImages[index];
    if (imageToRemove && imageToRemove.blobUrl) {
      URL.revokeObjectURL(imageToRemove.src);
      console.log("Revoked blob URL for removed image:", imageToRemove.id);
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, [uploadedImages]);

  // 保存对当前图片列表的引用，用于组件卸载时的清理
  const uploadedImagesRef = useRef<UploadedImage[]>(uploadedImages);
  uploadedImagesRef.current = uploadedImages;

  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      // 在组件卸载时清理所有 blob URLs
      uploadedImagesRef.current.forEach((img: UploadedImage) => { 
        if (img.blobUrl) {
          try {
            URL.revokeObjectURL(img.src);
            console.log("Cleanup: Revoked blob URL for image:", img.id);
          } catch (error) {
            console.warn("Failed to revoke blob URL:", error);
          }
        }
      });
    };
  }, []); // 仅在组件卸载时运行

  const addUrlImage = useCallback(async () => {
    if (!imageUrl.trim()) return;
    setIsLoadingUrl(true);
    try {
      // 简单校验：尝试加载
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      setUploadedImages((prev: UploadedImage[]) => [...prev, { id: `${Date.now()}_${Math.random()}`, src: imageUrl, isUrl: true }]);
      setImageUrl("");
      setShowUrlInput(false);
    } catch (e) {
      alert(t("errors.invalid_url"));
    } finally {
      setIsLoadingUrl(false);
    }
  }, [imageUrl]);

  // 真实的图像生成API调用
  const callGenerationAPI = async (params: {
    prompt: string;
    images: UploadedImage[];
    model: ModelType;
    aspectRatio: AspectRatio;
    imageCount: number;
    watermark: boolean;
  }) => {
    const response = await fetch('/api/ai-workstation/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Generation failed');
    }

    return await response.json();
  };

  // 生成进度模拟（在实际API调用期间显示进度）
  const simulateProgress = async () => {
    const stages = [
      { p: 10, s: "分析图像...", d: 800 },
      { p: 25, s: "理解提示词...", d: 1000 },
      { p: 40, s: "初始化AI模型...", d: 1200 },
      { p: 60, s: "生成图像变体...", d: 2000 },
      { p: 85, s: "应用编辑效果...", d: 1500 },
      { p: 95, s: "处理完成...", d: 500 },
    ];
    
    for (const stage of stages) {
      setGenerationProgress(stage.p);
      setGenerationStage(stage.s);
      await new Promise((resolve) => setTimeout(resolve, stage.d));
    }
  };

  const generateImages = useCallback(async () => {
    if (!prompt.trim() && uploadedImages.length === 0) {
      alert(t("errors.no_prompt_or_image"));
      return;
    }

    if (creditsError || userCredits < AI_WORKSTATION_CONFIG.api.creditsPerImage) {
      alert(t("errors.insufficient_credits_detailed", { credits: AI_WORKSTATION_CONFIG.api.creditsPerImage }));
      return;
    }
    
    // 防止重复提交
    if (isGenerating) {
      return;
    }
    
    // 防抖：防止过于频繁的生成请求
    const currentTime = Date.now();
    if (currentTime - lastGenerationTime < AI_WORKSTATION_CONFIG.ui.debounceTime) {
      alert(t("errors.frequent_submissions"));
      return;
    }
    setLastGenerationTime(currentTime);
    
    setIsGenerating(true);
    setElapsedTime(0);
    setShowResults(false);
    setGenerationProgress(0);
    setGenerationStage("准备生成...");
    
    try {
      // 开始进度模拟
      const progressPromise = simulateProgress();
      
      // 调用真实API
      const apiPromise = callGenerationAPI({
        prompt,
        images: uploadedImages,
        model: selectedModel,
        aspectRatio,
        imageCount,
        watermark,
      });
      
      // 等待API完成，但确保进度至少到95%
      const [apiResult] = await Promise.all([apiPromise, progressPromise]);
      
      // 完成进度
      setGenerationProgress(100);
      setGenerationStage("完成！");
      
      if (apiResult.success && apiResult.results) {
        setGeneratedResults(apiResult.results);
        setShowResults(true);
        
        // 更新当前生成的图片，用于CompareSlider的afterImage
        if (apiResult.results.length > 0) {
          const firstResult = apiResult.results[0];
          setCurrentGeneratedImage(firstResult.url);
          console.log("🎉 更新CompareSlider的afterImage:", firstResult.url);
        }
        
        // 更新积分显示 - 使用API返回的确切积分数
        if (apiResult.creditUsed) {
          if (apiResult.remainingCredits !== undefined) {
            // 优先使用API返回的确切剩余积分，避免竞态条件
            setUserCredits(apiResult.remainingCredits);
            console.log(`本次生成消耗 ${apiResult.creditUsed} 积分，剩余 ${apiResult.remainingCredits} 积分`);
          } else {
            // 原子更新操作，基于当前状态计算
            setUserCredits(prev => {
              const newCredits = Math.max(0, prev - apiResult.creditUsed);
              console.log(`本次生成消耗 ${apiResult.creditUsed} 积分，从 ${prev} 更新到 ${newCredits} 积分`);
              return newCredits;
            });
          }
        }
      } else {
        throw new Error(apiResult.message || "生成失败");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || t("errors.generation_failed"));
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage("");
    }
  }, [prompt, uploadedImages, imageCount, selectedModel, aspectRatio, watermark, userCredits]);

  const downloadImage = useCallback((url: string, filename: string): void => {
    const a = document.createElement("a");
    a.href = url; a.download = filename || "flux-kontext-result.jpg"; a.target = "_blank";
    document.body.appendChild(a); a.click(); a.remove();
  }, []);

  const refreshCredits = useCallback(async () => {
    setCreditsLoading(true);
    try {
      setCreditsError(false);
      const response = await fetch('/api/user/credits');
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits || 0);
      } else {
        throw new Error(`Failed to refresh credits: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
      setCreditsError(true);
      alert(t("errors.network_error"));
    } finally {
      setCreditsLoading(false);
    }
  }, [t]);

  const showRechargePrompt = useCallback(() => {
    alert(t("credits.insufficient_recharge"));
    // 实际的充值逻辑需要跳转到充值页面
    // window.location.href = '/recharge';
  }, [t]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧工作区 */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6">{t("title")}</h2>

          <Uploader
            images={uploadedImages}
            onAddFiles={addFiles}
            onAddUrl={addUrlImage}
            onClearAll={clearAllImages}
            onRemoveImage={removeImage}
            isLoadingUrl={isLoadingUrl}
            showUrl={showUrlInput}
            setShowUrl={setShowUrlInput}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />

          {/* 计数展示（保持和原图一致的 UI 提示） */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span className="text-sm">{uploadedImages.length > 0 ? `1/${uploadedImages.length}` : "1/2"} {t("image_upload.images_selected")}</span>
            </div>
          </div>

          <PromptControls prompt={prompt} setPrompt={setPrompt} onApplyTemplate={() => {}} />

          {/* 图像尺寸 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("dimensions.title")}</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Match Input", "2:3", "16:9", "1:1", "9:16"] as AspectRatio[]).map((ar) => (
                <Button 
                  key={ar} 
                  onClick={() => setAspectRatio(ar)} 
                  variant={aspectRatio === ar ? "default" : "outline"}
                  size="sm"
                  className="h-auto p-2"
                >
                  {ar}
                </Button>
              ))}
            </div>
          </div>

          {/* 模型选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("model.title")}</label>
            <p className="text-sm text-gray-500 mb-2">{t("model.description")}</p>
            <div className="flex gap-2">
              {(["Pro", "Max"] as ModelType[]).map((m) => (
                <Button 
                  key={m} 
                  onClick={() => setSelectedModel(m)} 
                  variant={selectedModel === m ? "default" : "secondary"}
                  size="sm"
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>

          {/* 数量 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("count.title")}</label>
            <p className="text-sm text-gray-500 mb-2">{t("count.description")}</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <Button 
                  key={n} 
                  onClick={() => setImageCount(n)} 
                  variant={imageCount === n ? "default" : "outline"}
                  size="icon"
                  className="w-10 h-10"
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          {/* 水印 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{t("watermark.title")}</label>
              <Switch 
                checked={watermark}
                onCheckedChange={setWatermark}
              />
            </div>
          </div>

          <div className="space-y-3">
            {/* 积分显示 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("credits.current_credits")}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {creditsLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : creditsError ? (
                    <span className="text-red-500">{t("credits.loading_failed")}</span>
                  ) : (
                    <span className={userCredits >= AI_WORKSTATION_CONFIG.api.creditsPerImage ? "text-green-600" : "text-red-500"}>
                      {userCredits} {t("user.credits")}
                    </span>
                  )}
                </span>
                <Button
                  onClick={refreshCredits}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 h-auto p-1"
                  title={t("credits.refresh")}
                  disabled={creditsLoading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={generateImages} 
              disabled={isGenerating || userCredits < AI_WORKSTATION_CONFIG.api.creditsPerImage || creditsError} 
              className="w-full py-6 text-lg font-medium" 
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t("generate.generating")}
                </>
              ) : creditsError ? (
                t("credits.loading_failed_refresh")
              ) : userCredits < AI_WORKSTATION_CONFIG.api.creditsPerImage ? (
                t("credits.insufficient_button", { credits: AI_WORKSTATION_CONFIG.api.creditsPerImage })
              ) : (
                t("generate.button")
              )}
            </Button>
            
            {creditsError && (
              <div className="text-center space-y-2">
                <p className="text-xs text-red-500">
                  {t("errors.credits_loading_failed")}
                </p>
                <Button
                  onClick={refreshCredits}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled={creditsLoading}
                >
                  {t("credits.reload")}
                </Button>
              </div>
            )}
            
            {!creditsError && userCredits < AI_WORKSTATION_CONFIG.api.creditsPerImage && (
              <div className="text-center space-y-2">
                <p className="text-xs text-red-500">
                  {t("credits.insufficient_recharge")}
                </p>
                <Button
                  onClick={showRechargePrompt}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {t("credits.go_recharge")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧结果工作区 */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6">{t("title")} {t("results.title")}</h2>
          <p className="text-gray-600 mb-2">{t("results.description")}</p>
          <p className="text-sm text-gray-500 mb-6">{t("results.time_label")} <span className="font-medium">{isGenerating || showResults ? formatTime(elapsedTime) : t("results.time_estimate")}</span></p>

          {isGenerating && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div className="bg-blue-500 h-4 transition-all" style={{ width: `${generationProgress}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{generationStage}</span>
                <span>{generationProgress}%</span>
              </div>
            </div>
          )}

          {showResults && generatedResults.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><span className="text-gray-700 font-medium">{t("results.title")}</span><span className="text-xs text-gray-500">{generatedResults.length} {t("image_upload.images_selected")}</span></div>
                <div className="flex gap-2">
                  <Button onClick={generateImages} variant="outline" size="sm" disabled={isGenerating}>{t("results.regenerate")}</Button>
                  <Button onClick={() => {setGeneratedResults([]); setShowResults(false); setElapsedTime(0); setCurrentGeneratedImage("");}} variant="outline" size="sm" disabled={isGenerating}>{t("results.clear")}</Button>
                </div>
              </div>
              
              {/* 显示对比滑块和结果网格 */}
              <div className="space-y-6">
                {/* 对比滑块 - 显示原图和生成图的对比 */}
                {currentGeneratedImage && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">{t("results.comparison_title")}</h3>
                    <CompareSlider
                      beforeSrc={uploadedImages.length > 0 ? uploadedImages[0].src : AI_WORKSTATION_CONFIG.fallbackImages.defaultBefore}
                      afterSrc={currentGeneratedImage}
                      split={split}
                      onSplitChange={setSplit}
                      height={384}
                    />
                  </div>
                )}
                
                {/* 结果网格 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{t("results.generation_results_title")}</h3>
                  <ResultGrid results={generatedResults} onDownload={downloadImage} />
                </div>
              </div>
            </div>
          ) : (
            !isGenerating && (
              <CompareSlider
                beforeSrc={uploadedImages.length > 0 ? uploadedImages[0].src : AI_WORKSTATION_CONFIG.fallbackImages.defaultBefore}
                afterSrc={currentGeneratedImage || AI_WORKSTATION_CONFIG.fallbackImages.defaultAfter}
                split={split}
                onSplitChange={setSplit}
                height={384}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}