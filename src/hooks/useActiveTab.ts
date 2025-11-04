import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { TabContent, getTabContent } from '@/types/aero';

export const useActiveTab = () => {
  const t = useTranslations();
  const [activeTabId, setActiveTabId] = useState<string>('cpm');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabsContent = useMemo(() => getTabContent(t), [t]);
  const activeTab = tabsContent.find(tab => tab.id === activeTabId) || tabsContent[0];

  const switchTab = useCallback((tabId: string) => {
    if (tabId === activeTabId) return;
    
    setIsTransitioning(true);
    
    // Smooth transition delay
    setTimeout(() => {
      setActiveTabId(tabId);
      setIsTransitioning(false);
    }, 200);
  }, [activeTabId]);

  return {
    activeTab,
    activeTabId,
    switchTab,
    isTransitioning,
    allTabs: tabsContent
  };
};
