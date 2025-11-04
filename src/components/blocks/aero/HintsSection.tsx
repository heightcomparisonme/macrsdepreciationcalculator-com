'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Film, Eraser, Palette, Music, Zap } from "lucide-react";
import { useLocale } from "next-intl";

interface HintsSectionProps {
  onHintClick?: (prompt: string) => void;
}

const HintsSection = ({ onHintClick }: HintsSectionProps) => {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Mondkalender related labels
  const cpmLabels = [
    "Mondkalender clickz",
    "Mondkalender youtube", 
    "Mondkalender formula",
    "Mondkalender trucking",
    "Mondkalender online",
    "Mondkalender marketing dive",
    "Mondkalender excel",
    "Mondkalender uk",
    "Mondkalender impressions",
    "youtube Mondkalender",
    "pert Mondkalender",
    "tiktok Mondkalender",
    "impression Mondkalender",
    "ultimate Mondkalender",
    "free Mondkalender",
    "youtube shorts Mondkalender",
    "adsterra Mondkalender",
    "cpv to Mondkalender",
    "average Mondkalender",
    "cpm impression calculator",
    "cpm to dpm calculator",
    "cpm to rpm calculator youtube",
    "cpm to msv calculator",
    "cpm rate calculator",
    "cpm cost calculator",
    "cpm to roentgen calculator",
    "cpm cpc calculator",
    "cpm revenue calculator",
    "cpm graphing calculator"
  ];

  const getHintsForCategory = () => {
    return cpmLabels.map((label, index) => ({
      icon: [Film, Eraser, Palette, Music, Zap][index % 5], // 循环使用图标
      label: label,
      color: ["text-purple-400", "text-blue-400", "text-pink-400", "text-orange-400", "text-cyan-400"][index % 5] // 循环使用颜色
    }));
  };

  const hints = getHintsForCategory();
  
  // 创建双倍数量的提示用于无缝滚动
  const duplicatedHints = [...hints, ...hints];

  // 自动滚动效果
  useEffect(() => {
    const scrollSpeed = 0.5; // 滚动速度
    let animationId: number;

    const animate = () => {
      setScrollPosition(prev => {
        const newPosition = prev + scrollSpeed;
        // 当滚动到第一组提示的末尾时，重置位置
        if (newPosition >= hints.length * 200) { // 假设每个按钮宽度约200px
          return 0;
        }
        return newPosition;
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [hints.length]);

  return (
    <div className="mt-6 w-full">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg overflow-hidden">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-white/70 mr-4 flex-shrink-0">{locale === 'zh' ? '提示：' : 'Hints:'}</span>
          
          {/* 走马灯容器 */}
          <div className="flex-1 overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex gap-2 transition-transform duration-1000 ease-linear"
              style={{ 
                transform: `translateX(-${scrollPosition}px)`,
                width: `${duplicatedHints.length * 200}px` // 动态宽度
              }}
            >
              {duplicatedHints.map((hint, index) => (
                <Button
                  key={`${hint.label}-${index}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => onHintClick?.(hint.label)}
                  className="bg-white/20 border border-white/30 hover:bg-white/30 hover:border-amber-400/50 text-white transition-all duration-200 hover:scale-105 flex-shrink-0 min-w-[200px]"
                >
                  <hint.icon className={`w-4 h-4 mr-2 ${hint.color}`} />
                  {hint.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintsSection;
