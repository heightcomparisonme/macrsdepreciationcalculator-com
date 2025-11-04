"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencySelector, CURRENCIES, type Currency } from "@/components/shared/CurrencySelector";

interface CalculatorValues {
  totalCost: string;
  cpm: string;
  impressions: string;
}


export default function CPMCalculatorBlock() {
  const t = useTranslations("calculator");

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
    <div className={"rounded-2xl p-8 bg-gradient-to-br from-blue-500/6 via-purple-600/5 to-indigo-700/5 backdrop-blur-2xl border border-white/30 shadow-2xl h-full flex flex-col relative overflow-hidden"}>
      {/* 流动的边缘高光效果 */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        {/* 流动的高光条 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-flow-highlight"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-flow-highlight" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/40 to-transparent animate-flow-highlight" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-white/40 to-transparent animate-flow-highlight" style={{ animationDelay: '3s' }}></div>

        {/* 角落流动高光 */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-white/30 via-white/20 to-transparent animate-corner-flow"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/30 via-white/20 to-transparent animate-corner-flow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-white/30 via-white/20 to-transparent animate-corner-flow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-white/30 via-white/20 to-transparent animate-corner-flow" style={{ animationDelay: '4.5s' }}></div>
      </div>

      {/* 磨砂颗粒效果 */}
      <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-8 right-6 w-3 h-3 bg-white/30 rounded-full animate-grain-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-16 left-8 w-2 h-2 bg-white/50 rounded-full animate-grain-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-32 left-16 w-3 h-3 bg-white/30 rounded-full animate-grain-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-40 right-8 w-2 h-2 bg-white/50 rounded-full animate-grain-float" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-48 left-12 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-56 right-16 w-3 h-3 bg-white/30 rounded-full animate-grain-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-64 left-20 w-2 h-2 bg-white/50 rounded-full animate-grain-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-72 right-24 w-2 h-2 bg-white/40 rounded-full animate-grain-float" style={{ animationDelay: '3.5s' }}></div>
      </div>

      {/* 主要内容区域 - CPM 计算器 */}
      <div className="flex-1 flex flex-col justify-start pt-4">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-white">{t("title")}</h2>
              <p className="text-gray-300 text-sm">{t("description")}</p>
            </div>
            <CurrencySelector currency={currency} onCurrencyChange={setCurrency} />
          </div>
        </div>

        {/* 表单字段区域 */}
        <div className="space-y-6 mb-6">
          {/* 总广告费用 */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="totalCost" className="text-lg font-semibold text-white">
                  {t('total_cost.label')}
                </Label>
                <p className="text-sm text-gray-300">
                  {t('total_cost.description')}
                </p>
              </div>
              <div className="w-40">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-medium">
                    {currency.symbol}
                  </span>
                  <Input
                    id="totalCost"
                    type="text"
                    placeholder={t('placeholders.total_cost')}
                    value={values.totalCost}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("totalCost", e.target.value)}
                    className="text-lg h-12 pl-8 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CPM */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="cpm" className="text-lg font-semibold text-white">
                  {t('cpm.label')}
                </Label>
                <p className="text-sm text-gray-300">
                  {t('cpm.description')}
                </p>
              </div>
              <div className="w-40">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-medium">
                    {currency.symbol}
                  </span>
                  <Input
                    id="cpm"
                    type="text"
                    placeholder={t('placeholders.cpm')}
                    value={values.cpm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cpm", e.target.value)}
                    className="text-lg h-12 pl-8 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 展示次数 */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="impressions" className="text-lg font-semibold text-white">
                  {t('impressions.label')}
                </Label>
                <p className="text-sm text-gray-300">
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
                  className="text-lg h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 按钮区域 */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex-1 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {t('buttons.reset')}
          </Button>
          <Button
            onClick={calculate}
            size="lg"
            className="flex-1 h-12 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          >
            {t('buttons.calculate')}
          </Button>
        </div>

        {/* 计算结果显示 */}
        {showResults && (
          <div className="mt-4 p-6 bg-white/5 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-4 text-white">{t('results.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-300">{t('results.total_cost_label')}</p>
                <p className="text-2xl font-bold text-green-400">
                  {currency.symbol}{values.totalCost || "0"}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-300">{t('results.cpm_label')}</p>
                <p className="text-2xl font-bold text-blue-400">
                  {currency.symbol}{values.cpm || "0"}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-300">{t('results.impressions_label')}</p>
                <p className="text-2xl font-bold text-purple-400">
                  {Number(values.impressions || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
