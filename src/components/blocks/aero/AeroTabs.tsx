'use client';

import { Button } from "@/components/ui/button";
import { TabContent } from "@/types/aero";

interface AeroTabsProps {
  tabs: TabContent[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  isTransitioning: boolean;
}

const AeroTabs = ({ tabs, activeTabId, onTabChange, isTransitioning }: AeroTabsProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "secondary"}
              size="lg"
              onClick={() => onTabChange(tab.id)}
              disabled={isTransitioning}
              className={`
                w-full px-4 py-3 text-sm md:text-base font-semibold h-12
                transition-all duration-300 transform hover:scale-105
                ${isActive 
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg animate-pulse" 
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-amber-400/50 backdrop-blur-sm"
                }
                ${isTransitioning ? "opacity-70" : ""}
              `}
            >
              <span className="truncate">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AeroTabs;
