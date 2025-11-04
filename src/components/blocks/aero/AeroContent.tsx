'use client';

import { TabContent } from "@/types/aero";

interface AeroContentProps {
  activeTab: TabContent;
  isTransitioning: boolean;
}

const AeroContent = ({ activeTab, isTransitioning }: AeroContentProps) => {
  return (
    <div className={`
      max-w-6xl mx-auto text-center transition-all duration-500
      ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0 animate-fade-in'}
    `}>
      {/* Main Headlines */}
      <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
        <span className="text-white">{activeTab.title.split(' ').slice(0, -3).join(' ')}</span>{" "}
        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          {activeTab.title.split(' ').slice(-3).join(' ')}
        </span>
      </h1>
      
      <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-amber-400">
        {activeTab.subtitle}
      </h2>
      
      <p className="text-lg lg:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
        {activeTab.description}
      </p>
    </div>
  );
};

export default AeroContent;
