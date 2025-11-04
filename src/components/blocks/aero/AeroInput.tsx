'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image } from "lucide-react";
import { TabContent } from "@/types/aero";
import React, { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";

interface AeroInputProps {
  activeTab: TabContent;
  isTransitioning: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onCalculate?: () => void;
}

// Typewriter effect component
const TypewriterPlaceholder = ({ text, isActive }: { text: string; isActive: boolean }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) return;

    let currentIndex = 0;
    let isDeleting = false;
    
    const typeText = () => {
      if (isDeleting) {
        // Delete text
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayText(text.slice(0, currentIndex));
          timeoutRef.current = setTimeout(typeText, 100);
        } else {
          isDeleting = false;
          timeoutRef.current = setTimeout(typeText, 1000); // Pause 1 second
        }
      } else {
        // Type text
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayText(text.slice(0, currentIndex));
          timeoutRef.current = setTimeout(typeText, 150);
        } else {
          isDeleting = true;
          timeoutRef.current = setTimeout(typeText, 2000); // Pause 2 seconds
        }
      }
    };

    typeText();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isActive]);

  // Cursor blinking effect
  useEffect(() => {
    if (!isActive) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => clearInterval(cursorInterval);
  }, [isActive]);

  if (!isActive) {
    return <span className="text-white/60">{text}</span>;
  }

  return (
    <span className="text-white/60">
      {displayText}
              <span 
          className={`inline-block w-0.5 h-5 bg-white/80 ml-1 transition-opacity duration-200 animate-typewriter-cursor ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
    </span>
  );
};

const AeroInput = ({ activeTab, isTransitioning, inputValue, onInputChange, onCalculate }: AeroInputProps) => {
  const locale = useLocale();
  const [localValue, setLocalValue] = useState(inputValue || "");
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(true);

  useEffect(() => {
    if (inputValue !== undefined) {
      setLocalValue(inputValue);
    }
  }, [inputValue]);

  // When user starts typing, stop typewriter effect
  useEffect(() => {
    if (localValue.length > 0) {
      setIsPlaceholderActive(false);
    } else {
      setIsPlaceholderActive(true);
    }
  }, [localValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    onInputChange?.(value);
  };

  // When switching tabs, reactivate typewriter effect
  useEffect(() => {
    setIsPlaceholderActive(true);
  }, [activeTab.id]);

  return (
    <div className={`
      w-full transition-all duration-500
      ${isTransitioning ? 'opacity-70 transform scale-95' : 'opacity-100 transform scale-100'}
    `}>
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <Textarea
            key={activeTab.id} // Force re-render to update placeholder
            value={localValue}
            onChange={handleInputChange}
            placeholder=""
            className="w-full min-h-[120px] bg-transparent border-0 text-lg resize-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 text-white"
          />
          
          {/* Typewriter effect placeholder */}
          {localValue.length === 0 && (
            <div className="absolute top-3 left-3 pointer-events-none text-lg text-white/60 leading-6">
              <TypewriterPlaceholder
                text={activeTab.placeholder}
                isActive={isPlaceholderActive}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200"
          >
            {/* <Image className="w-4 h-4 mr-2" /> */}
            {/* {locale === 'zh' ? '添加图像' : 'Add Image'} */}
          </Button>
          
          <div className="relative">
            {/* Outer pulse ring animation */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse-ring"></div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 opacity-10 animate-pulse-ring-delayed"></div>

            <Button
              onClick={onCalculate}
              className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-heartbeat"
            >
              <Send className="w-4 h-4 mr-2" />
              {locale === 'zh' ? '开始计算' : 'Calculate'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AeroInput;
