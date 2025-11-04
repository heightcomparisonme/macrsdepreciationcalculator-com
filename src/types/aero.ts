export interface TabContent {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  placeholder: string;
  backgroundImage: string;
  category: 'cpm' | 'cpc' | 'cpa' | 'ctr' | 'roi' | 'youtube';
}

/**
 * 使用翻译函数生成 Tab 内容
 * @param t - 翻译函数 (来自 useTranslations 或 getTranslations)
 * @returns TabContent 数组
 */
export const getTabContent = (t: (key: string) => string): TabContent[] => {
  return [
    {
      id: "cpm",
      label: t('aero_section.tabs.cpm'),
      title: t('aero_section.content.cpm.title'),
      subtitle: t('aero_section.content.cpm.subtitle'),
      description: t('aero_section.content.cpm.description'),
      placeholder: t('aero_section.content.cpm.placeholder'),
      backgroundImage: "/src/assets/cpm-calculator-bg.jpg",
      category: "cpm" as const
    },
    {
      id: "cpc",
      label: t('aero_section.tabs.cpc'),
      title: t('aero_section.content.cpc.title'),
      subtitle: t('aero_section.content.cpc.subtitle'),
      description: t('aero_section.content.cpc.description'),
      placeholder: t('aero_section.content.cpc.placeholder'),
      backgroundImage: "/src/assets/cpc-calculator-bg.jpg",
      category: "cpc" as const
    },
    {
      id: "cpa",
      label: t('aero_section.tabs.cpa'),
      title: t('aero_section.content.cpa.title'),
      subtitle: t('aero_section.content.cpa.subtitle'),
      description: t('aero_section.content.cpa.description'),
      placeholder: t('aero_section.content.cpa.placeholder'),
      backgroundImage: "/src/assets/cpa-calculator-bg.jpg",
      category: "cpa" as const
    },
    {
      id: "ctr",
      label: t('aero_section.tabs.ctr'),
      title: t('aero_section.content.ctr.title'),
      subtitle: t('aero_section.content.ctr.subtitle'),
      description: t('aero_section.content.ctr.description'),
      placeholder: t('aero_section.content.ctr.placeholder'),
      backgroundImage: "/src/assets/ctr-calculator-bg.jpg",
      category: "ctr" as const
    },
    {
      id: "roi",
      label: t('aero_section.tabs.roi'),
      title: t('aero_section.content.roi.title'),
      subtitle: t('aero_section.content.roi.subtitle'),
      description: t('aero_section.content.roi.description'),
      placeholder: t('aero_section.content.roi.placeholder'),
      backgroundImage: "/src/assets/roi-calculator-bg.jpg",
      category: "roi" as const
    },
    {
      id: "youtube",
      label: t('aero_section.tabs.youtube'),
      title: t('aero_section.content.youtube.title'),
      subtitle: t('aero_section.content.youtube.subtitle'),
      description: t('aero_section.content.youtube.description'),
      placeholder: t('aero_section.content.youtube.placeholder'),
      backgroundImage: "/src/assets/youtube-cpm-bg.jpg",
      category: "youtube" as const
    }
  ];
};
