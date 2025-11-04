import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ControlPanelProps } from '@/types/hero';
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencySelector, CURRENCIES, type Currency } from "@/components/shared/CurrencySelector";

interface CalculatorValues {
  totalCost: string;
  cpm: string;
  impressions: string;
}

/**
 * ControlPanel - CPM 计算器组件
 *
 * 替换原有的图片上传功能为CPM计算器
 * 保持白色卡片样式和布局结构
 */
export default function ControlPanel({
  state,
  onChange,
  onBackToOne,
  currentMode,
  className,
  maxImages = 5,
  maxPromptLength = 1000,
  showBackButton = true,
}: ControlPanelProps) {
  const t = useTranslations('calculator');

  // CPM 计算器状态
  const [values, setValues] = useState<CalculatorValues>({
    totalCost: "",
    cpm: "",
    impressions: "",
  });

  const [lastEdited, setLastEdited] = useState<keyof CalculatorValues | null>(null);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof CalculatorValues, value: string) => {
    // 只允许数字和小数点
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setValues((prev) => ({ ...prev, [field]: value }));
    setLastEdited(field);
  };

  const calculate = () => {
    const cost = Number.parseFloat(values.totalCost) || 0;
    const cpmValue = Number.parseFloat(values.cpm) || 0;
    const impressionsValue = Number.parseFloat(values.impressions) || 0;

    // 计算逻辑：根据已填写的两个值计算第三个值
    const filledFields = [
      values.totalCost && "totalCost",
      values.cpm && "cpm",
      values.impressions && "impressions",
    ].filter(Boolean);

    if (filledFields.length < 2) {
      alert(t('error_min_fields'));
      return;
    }

    if (filledFields.length === 3) {
      // 如果三个都填了，根据最后编辑的字段决定计算哪个
      if (lastEdited === "totalCost") {
        // 计算总成本
        const newCost = (cpmValue * impressionsValue) / 1000;
        setValues((prev) => ({ ...prev, totalCost: newCost.toFixed(2) }));
      } else if (lastEdited === "cpm") {
        // 计算 CPM
        const newCpm = (cost / impressionsValue) * 1000;
        setValues((prev) => ({ ...prev, cpm: newCpm.toFixed(2) }));
      } else {
        // 计算展示次数
        const newImpressions = (cost / cpmValue) * 1000;
        setValues((prev) => ({ ...prev, impressions: newImpressions.toFixed(0) }));
      }
    } else {
      // 只填了两个，计算第三个
      if (!values.totalCost) {
        // 计算总成本: Total Cost = (CPM × Impressions) / 1000
        const newCost = (cpmValue * impressionsValue) / 1000;
        setValues((prev) => ({ ...prev, totalCost: newCost.toFixed(2) }));
      } else if (!values.cpm) {
        // 计算 CPM: CPM = (Total Cost / Impressions) × 1000
        const newCpm = (cost / impressionsValue) * 1000;
        setValues((prev) => ({ ...prev, cpm: newCpm.toFixed(2) }));
      } else {
        // 计算展示次数: Impressions = (Total Cost / CPM) × 1000
        const newImpressions = (cost / cpmValue) * 1000;
        setValues((prev) => ({ ...prev, impressions: newImpressions.toFixed(0) }));
      }
    }
    
    setShowResults(true);
  };

  const reset = () => {
    setValues({ totalCost: "", cpm: "", impressions: "" });
    setLastEdited(null);
    setShowResults(false);
  };

  return (
    <div className={cn(
      "rounded-2xl p-6 bg-gradient-to-br from-gray-900 to-black shadow-2xl border border-gray-700/50 h-full flex flex-col relative overflow-hidden",
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
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{t('title')}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">{t('description')}</p>
          </div>
          <CurrencySelector currency={currency} onCurrencyChange={setCurrency} />
        </div>
      </div>

      {/* 表单字段区域 */}
      <div className="space-y-8 mb-8 relative z-10">
        {/* 总广告费用 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-3">
              <Label htmlFor="totalCost" className="text-lg font-semibold text-cyan-400">
                {t('total_cost.label')}
              </Label>
              <p className="text-base text-gray-300 leading-relaxed">
                {t('total_cost.description')}
              </p>
            </div>
            <div className="w-40">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-semibold text-lg">
                  {currency.symbol}
                </span>
                <Input
                  id="totalCost"
                  type="text"
                  placeholder={t('placeholders.total_cost')}
                  value={values.totalCost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("totalCost", e.target.value)}
                  className="h-14 pl-12 text-lg bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CPM */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-3">
              <Label htmlFor="cpm" className="text-lg font-semibold text-blue-400">
                {t('cpm.label')}
              </Label>
              <p className="text-base text-gray-300 leading-relaxed">
                {t('cpm.description')}
              </p>
            </div>
            <div className="w-40">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-semibold text-lg">
                  {currency.symbol}
                </span>
                <Input
                  id="cpm"
                  type="text"
                  placeholder={t('placeholders.cpm')}
                  value={values.cpm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cpm", e.target.value)}
                  className="h-14 pl-12 text-lg bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 展示次数 */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-3">
              <Label htmlFor="impressions" className="text-lg font-semibold text-purple-400">
                {t('impressions.label')}
              </Label>
              <p className="text-base text-gray-300 leading-relaxed">
                {t('impressions.description')}
              </p>
            </div>
            <div className="w-40">
              <Input
                id="impressions"
                type="text"
                placeholder={t('placeholders.impressions')}
                value={values.impressions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("impressions", e.target.value)}
                className="h-14 text-lg bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 计算结果显示 */}
      {showResults && (
        <div className="mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-600/50 backdrop-blur-sm relative z-10">
          <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{t('results.title')}</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center p-5 bg-gray-800/50 rounded-lg border border-cyan-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent"></div>
              <p className="text-sm font-medium text-cyan-400 relative z-10 mb-2">{t('results.total_cost_label')}</p>
              <p className="text-2xl font-bold text-cyan-300 relative z-10">
                {currency.symbol}{values.totalCost || "0"}
              </p>
            </div>
            <div className="text-center p-5 bg-gray-800/50 rounded-lg border border-blue-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent"></div>
              <p className="text-sm font-medium text-blue-400 relative z-10 mb-2">{t('results.cpm_label')}</p>
              <p className="text-2xl font-bold text-blue-300 relative z-10">
                {currency.symbol}{values.cpm || "0"}
              </p>
            </div>
            <div className="text-center p-5 bg-gray-800/50 rounded-lg border border-purple-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-transparent"></div>
              <p className="text-sm font-medium text-purple-400 relative z-10 mb-2">{t('results.impressions_label')}</p>
              <p className="text-2xl font-bold text-purple-300 relative z-10">
                {Number(values.impressions || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 底部按钮区域 */}
      <div className="mt-auto pt-6 relative z-10">
        {/* 计算和重置按钮 */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-lg bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 focus:ring-cyan-400/20"
          >
            {t('buttons.reset')}
          </Button>
          <Button
            onClick={calculate}
            size="lg"
            className="flex-1 h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/25"
          >
            {t('buttons.calculate')}
          </Button>
        </div>

        {/* 返回按钮 - 只在 hero-two 模式下显示 */}
        {currentMode === 'two' && showBackButton && onBackToOne && (
          <button
            className="w-full text-base text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/20 rounded-lg py-3 border border-gray-600/50 hover:border-cyan-400/50"
            onClick={onBackToOne}
            aria-label="Return to hero mode one"
          >
            ← Back to Mode One
          </button>
        )}
      </div>
    </div>
  );
}
