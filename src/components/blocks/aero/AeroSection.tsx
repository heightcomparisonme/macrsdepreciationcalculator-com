'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AeroTabs from "./AeroTabs";
import AeroContent from "./AeroContent";
import AeroInput from "./AeroInput";
import HintsSection from "./HintsSection";
import ColorBackground from "./ColorBackground";
import ImageBackground from "./ImageBackground";
import VideoBackground from "./VideoBackground";
import { useActiveTab } from "@/hooks/useActiveTab";

const AeroSection = () => {
  const router = useRouter();
  const { activeTab, activeTabId, switchTab, isTransitioning, allTabs } = useActiveTab();
  const [inputValue, setInputValue] = useState("");
  
  // 根据活跃标签切换背景类型和预设
  const getBackgroundConfig = (tabId: string) => {
    switch (tabId) {
      case 'cpm':
        return { type: 'color' as const, presetId: '1' }; // 深空渐变
      case 'cpc':
        return { type: 'color' as const, presetId: '2' }; // 霓虹脉冲
      case 'cpa':
        return { type: 'color' as const, presetId: '3' }; // 几何迷宫
      case 'ctr':
        return { type: 'color' as const, presetId: '4' }; // 粒子风暴
      case 'roi':
        return { type: 'color' as const, presetId: '5' }; // 火焰之舞
      case 'youtube':
        return { type: 'color' as const, presetId: '6' }; // 极光梦境
      default:
        return { type: 'color' as const, presetId: '1' };
    }
  };
  
  const [backgroundConfig, setBackgroundConfig] = useState(getBackgroundConfig(activeTabId));

  // 标签切换时更新背景
  const handleTabChange = (tabId: string) => {
    switchTab(tabId);
    setBackgroundConfig(getBackgroundConfig(tabId));
  };

  // 计算按钮点击处理 - updated to Mondkalender tools
  const handleCalculate = () => {
    const routeMap: Record<string, string> = {
      'cpm': '/mondkalender-2026',
      'cpc': '/tools/mondkalender-haare-schneiden',
      'cpa': '/tools/kochen',
      'ctr': '/tools/auf-untergang',
      'roi': '/mondkalender-2026-zum-ausdrucken',
      'youtube': '/tools/mond-heute'
    };

    const route = routeMap[activeTabId];
    if (route) {
      router.push(route);
    }
  };

  const renderBackground = () => {
    if (backgroundConfig.type === 'color') {
      return <ColorBackground presetId={backgroundConfig.presetId} />;
    } else if (backgroundConfig.type === 'image') {
      return <ImageBackground />;
    } else if (backgroundConfig.type === 'video') {
      return <VideoBackground />;
    } else {
      return <ColorBackground presetId={backgroundConfig.presetId} />;
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Dynamic Background */}
      {renderBackground()}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-16">
        <AeroContent activeTab={activeTab} isTransitioning={isTransitioning} />
        
        {/* Tabs and Input container with consistent width */}
        <div className="w-full max-w-6xl mx-auto">
          {/* Tabs */}
          <AeroTabs 
            tabs={allTabs}
            activeTabId={activeTabId}
            onTabChange={handleTabChange}
            isTransitioning={isTransitioning}
          />
          
          {/* Input Section */}
          <AeroInput 
            activeTab={activeTab} 
            isTransitioning={isTransitioning}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onCalculate={handleCalculate}
          />
          
          {/* Hints Section */}
          <HintsSection onHintClick={setInputValue} />
        </div>
      </div>
    </section>
  );
};

export default AeroSection;
