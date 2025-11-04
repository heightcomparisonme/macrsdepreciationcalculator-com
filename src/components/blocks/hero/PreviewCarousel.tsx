'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, TrendingUp, Globe, Building2 } from 'lucide-react';
import { PreviewCarouselProps } from '@/types/hero';
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// CPM 数据配置
interface CPMData {
  country: string;
  industry: string;
  cpm: number;
  currency: string;
  trend: 'up' | 'down' | 'stable';
}

const countries = [
  'United States', 'China', 'Japan', 'Germany', 'United Kingdom', 
  'India', 'France', 'Brazil', 'Italy', 'Canada', 'South Korea', 'Australia'
];

const industries = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
  'Entertainment', 'Automotive', 'Real Estate', 'Travel', 'Food & Beverage',
  'Fashion', 'Sports', 'Gaming', 'Media', 'Telecommunications'
];

// 模拟 CPM 数据
const generateCPMData = (): CPMData[] => {
  const data: CPMData[] = [];
  const currencies = ['USD', 'CNY', 'JPY', 'EUR', 'GBP'];
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  
  countries.forEach(country => {
    industries.forEach(industry => {
      data.push({
        country,
        industry,
        cpm: Math.floor(Math.random() * 50) + 5, // 5-55 范围
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        trend: trends[Math.floor(Math.random() * trends.length)]
      });
    });
  });
  
  return data;
};

/**
 * CPMDataSelector - CPM 数据选择器组件
 *
 * 支持按国家和行业筛选 CPM 数据
 * 提供搜索、排序和趋势分析功能
 */
export default function CPMDataSelector({
  className,
}: PreviewCarouselProps) {
  const t = useTranslations('cpm_data_selector');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortBy, setSortBy] = useState<'cpm' | 'country' | 'industry'>('cpm');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const cpmData = generateCPMData();

  // 筛选和排序数据
  const filteredData = cpmData
    .filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry === '' || item.country === selectedCountry;
      const matchesIndustry = selectedIndustry === '' || item.industry === selectedIndustry;
      return matchesSearch && matchesCountry && matchesIndustry;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];
      
      if (sortBy === 'cpm') {
        aValue = a.cpm;
        bValue = b.cpm;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    })
    .slice(0, 12); // 限制显示数量

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className={cn(
      "rounded-2xl p-8 bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl h-full flex flex-col relative overflow-hidden",
      className
    )}>
      {/* 科技感装饰效果 */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {/* 流动的边缘高光效果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-cyan-400/60 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-cyan-400/60 to-transparent animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* 角落科技光点 */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* 标题区域 */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{t('title')}</h2>
              <p className="text-lg text-gray-300 mt-1">{t('description')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-yellow-400">{filteredData.length}</div>
            <div className="text-sm text-gray-400">{t('results_count')}</div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="mb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="md:col-span-2">
            <Label htmlFor="search" className="text-sm font-medium text-cyan-400 mb-2 block">
              {t('search_placeholder')}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          {/* 国家选择 */}
          <div>
            <Label htmlFor="country" className="text-sm font-medium text-blue-400 mb-2 block">
              <Globe className="w-4 h-4 inline mr-2" />
              {t('country_label')}
            </Label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full h-12 px-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:border-blue-400 focus:ring-blue-400/20"
            >
              <option value="">{t('all_countries')}</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* 行业选择 */}
          <div>
            <Label htmlFor="industry" className="text-sm font-medium text-purple-400 mb-2 block">
              <Building2 className="w-4 h-4 inline mr-2" />
              {t('industry_label')}
            </Label>
            <select
              id="industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full h-12 px-3 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:border-purple-400 focus:ring-purple-400/20"
            >
              <option value="">{t('all_industries')}</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 数据展示区域 */}
      <div className="flex-1 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {filteredData.map((item, index) => (
            <div key={index} className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/50 hover:border-cyan-400/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-300">{item.country}</span>
                </div>
                {getTrendIcon(item.trend)}
              </div>
              
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-white mb-1">{item.industry}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-cyan-300">{item.cpm}</span>
                  <span className="text-sm text-gray-400">{item.currency}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                CPM • {item.trend === 'up' ? t('trend_up') : item.trend === 'down' ? t('trend_down') : t('trend_stable')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作区域 */}
      <div className="mt-6 relative z-10">
        <div className="flex gap-4">
          <Button className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold">
            {t('export_data')}
          </Button>
          <Button variant="outline" className="h-12 bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50">
            {t('view_details')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// 预设配置
export const CPMDataSelectorConfigs = {
  default: {
    showControls: true,
    autoSlide: false,
  },
  autoplay: {
    showControls: true,
    autoSlide: true,
    slideInterval: 4000,
  },
  minimal: {
    showControls: false,
    autoSlide: false,
  },
};
