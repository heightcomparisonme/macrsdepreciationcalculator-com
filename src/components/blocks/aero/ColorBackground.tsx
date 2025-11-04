'use client';

import { useState, useEffect } from "react";
import { Palette, Sparkles, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

interface ColorPreset {
  id: string;
  name: string;
  type: 'gradient' | 'animated' | 'geometric' | 'particle';
  colors: string[];
  animation?: string;
}

interface ColorBackgroundProps {
  presetId?: string;
}

const ColorBackground = ({ presetId }: ColorBackgroundProps) => {
  const locale = useLocale();
  
  const colorPresets: ColorPreset[] = [
    {
      id: "1",
      name: locale === 'zh' ? "深空渐变" : "Deep Space",
      type: 'gradient',
      colors: ['#0f0f23', '#1a1a2e', '#16213e', '#0f3460']
    },
    {
      id: "2",
      name: locale === 'zh' ? "霓虹脉冲" : "Neon Pulse",
      type: 'animated',
      colors: ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5'],
      animation: 'pulse'
    },
    {
      id: "3",
      name: locale === 'zh' ? "几何迷宫" : "Geometric Maze",
      type: 'geometric',
      colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
    },
    {
      id: "4",
      name: locale === 'zh' ? "粒子风暴" : "Particle Storm",
      type: 'particle',
      colors: ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7']
    },
    {
      id: "5",
      name: locale === 'zh' ? "火焰之舞" : "Fire Dance",
      type: 'animated',
      colors: ['#ff9a9e', '#fecfef', '#fecfef', '#ff9a9e'],
      animation: 'wave'
    },
    {
      id: "6",
      name: locale === 'zh' ? "极光梦境" : "Aurora Dreams",
      type: 'gradient',
      colors: ['#a8edea', '#fed6e3', '#d299c2', '#fef9d7']
    }
  ];

  // 根据 presetId 选择对应的预设，如果没有指定则使用第一个
  const getInitialPreset = () => {
    if (presetId) {
      const preset = colorPresets.find(p => p.id === presetId);
      return preset || colorPresets[0];
    }
    return colorPresets[0];
  };

  const [activePreset, setActivePreset] = useState<ColorPreset>(getInitialPreset());
  const [showControls, setShowControls] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // 当 presetId 变化时更新活跃预设
  useEffect(() => {
    if (presetId) {
      const preset = colorPresets.find(p => p.id === presetId);
      if (preset) {
        setActivePreset(preset);
      }
    }
  }, [presetId]);

  const getBackgroundStyle = (preset: ColorPreset) => {
    const baseStyle = {
      background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
    };

    switch (preset.type) {
      case 'animated':
        return {
          ...baseStyle,
          animation: preset.animation === 'pulse' 
            ? `pulse ${3 / animationSpeed}s ease-in-out infinite`
            : `wave ${4 / animationSpeed}s ease-in-out infinite`,
        };
      case 'geometric':
        return {
          ...baseStyle,
          backgroundImage: `
            linear-gradient(135deg, ${preset.colors.join(', ')}),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
        };
      case 'particle':
        return {
          ...baseStyle,
          backgroundImage: `
            linear-gradient(135deg, ${preset.colors.join(', ')}),
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 25%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 25%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 25%)
          `,
          animation: `particleFloat ${6 / animationSpeed}s ease-in-out infinite`,
        };
      default:
        return baseStyle;
    }
  };

  const handlePresetSelect = (preset: ColorPreset) => {
    setActivePreset(preset);
    setShowControls(false);
  };

  return (
    <>
      {/* Dynamic Color Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={getBackgroundStyle(activePreset)}
      >
        {/* Animated Elements */}
        {activePreset.type === 'geometric' && (
          <>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/30 rotate-45 animate-spin" style={{ animationDuration: `${8 / animationSpeed}s` }} />
              <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/20 rotate-12 animate-pulse" style={{ animationDuration: `${3 / animationSpeed}s` }} />
              <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border border-white/25 -rotate-12 animate-bounce" style={{ animationDuration: `${4 / animationSpeed}s` }} />
            </div>
          </>
        )}

        {activePreset.type === 'particle' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${(2 + Math.random() * 3) / animationSpeed}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Color Controls - Top Right */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 px-3"
        >
          <Palette className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '更换背景' : 'Change Background'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAnimationSpeed(animationSpeed === 1 ? 2 : animationSpeed === 2 ? 0.5 : 1)}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
        >
          <Zap className="w-4 h-4" />
        </Button>
      </div>

      {/* Color Preset Panel */}
      {showControls && (
        <div className="absolute top-20 right-6 z-40 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-80">
          <div className="grid grid-cols-2 gap-3">
            {colorPresets.map((preset) => (
              <div
                key={preset.id}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  activePreset.id === preset.id 
                    ? 'ring-2 ring-golden shadow-golden' 
                    : 'hover:ring-1 hover:ring-white/50'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                {/* Color Preview */}
                <div 
                  className="w-full h-20 relative"
                  style={getBackgroundStyle(preset)}
                >
                  {/* Type Icon */}
                  <div className="absolute top-2 left-2">
                    {preset.type === 'gradient' && <Palette className="w-4 h-4 text-white/80" />}
                    {preset.type === 'animated' && <Sparkles className="w-4 h-4 text-white/80" />}
                    {preset.type === 'geometric' && <Settings className="w-4 h-4 text-white/80" />}
                    {preset.type === 'particle' && <Zap className="w-4 h-4 text-white/80" />}
                  </div>
                  
                  {/* Active Indicator */}
                  {activePreset.id === preset.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-golden rounded-full animate-pulse" />
                  )}
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">
                    {preset.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Speed Control */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">
                {locale === 'zh' ? '动画速度' : 'Animation Speed'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnimationSpeed(0.5)}
                  className={`w-8 h-8 p-0 text-xs ${animationSpeed === 0.5 ? 'bg-golden/20 text-golden' : 'text-white/60'}`}
                >
                  0.5x
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnimationSpeed(1)}
                  className={`w-8 h-8 p-0 text-xs ${animationSpeed === 1 ? 'bg-golden/20 text-golden' : 'text-white/60'}`}
                >
                  1x
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnimationSpeed(2)}
                  className={`w-8 h-8 p-0 text-xs ${animationSpeed === 2 ? 'bg-golden/20 text-golden' : 'text-white/60'}`}
                >
                  2x
                </Button>
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowControls(false)}
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-black/60 text-white hover:bg-black/80 rounded-full"
          >
            ×
          </Button>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(10px) rotate(1deg); }
          50% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(0.5deg); }
        }
        
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

export default ColorBackground;
