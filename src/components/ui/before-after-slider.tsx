"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算滑块位置
  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    return percentage;
  }, []);

  // 全局鼠标移动处理
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const percentage = calculatePosition(e.clientX);
      setSliderPosition(percentage);
    },
    [isDragging, calculatePosition]
  );

  // 全局鼠标释放处理
  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 全局触摸移动处理
  const handleGlobalTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const percentage = calculatePosition(e.touches[0].clientX);
      setSliderPosition(percentage);
    },
    [isDragging, calculatePosition]
  );

  // 全局触摸结束处理
  const handleGlobalTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 键盘支持
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSliderPosition(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSliderPosition(prev => Math.min(100, prev + 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setSliderPosition(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSliderPosition(100);
      }
    },
    []
  );

  // 容器点击处理
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const percentage = calculatePosition(e.clientX);
      setSliderPosition(percentage);
    },
    [isDragging, calculatePosition]
  );

  // 滑块拖拽开始
  const handleSliderMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // 滑块触摸开始
  const handleSliderTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // 设置全局事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
      document.addEventListener("touchend", handleGlobalTouchEnd);
      
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
        document.removeEventListener("touchmove", handleGlobalTouchMove);
        document.removeEventListener("touchend", handleGlobalTouchEnd);
      };
    }
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp, handleGlobalTouchMove, handleGlobalTouchEnd]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg cursor-col-resize select-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        className
      )}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label={`${beforeAlt} and ${afterAlt} comparison slider`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={sliderPosition}
      aria-valuetext={`${Math.round(sliderPosition)}% ${afterAlt}`}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Overlay with clip-path) */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-col-resize z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 transition-all duration-200",
            isDragging 
              ? "border-primary scale-110 shadow-xl" 
              : "border-gray-200 hover:border-primary hover:scale-105"
          )}
          onMouseDown={handleSliderMouseDown}
          onTouchStart={handleSliderTouchStart}
          role="button"
          tabIndex={-1}
          aria-label="Drag to adjust comparison"
        >
          <div className="flex space-x-1">
            <div className="w-0.5 h-5 bg-gray-400"></div>
            <div className="w-0.5 h-5 bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-medium backdrop-blur-sm">
        {beforeAlt}
      </div>
      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-medium backdrop-blur-sm">
        {afterAlt}
      </div>

      {/* Keyboard instructions (screen reader only) */}
      <div className="sr-only">
        Use arrow keys to adjust the comparison. Home and End keys jump to extremes.
      </div>
    </div>
  );
}