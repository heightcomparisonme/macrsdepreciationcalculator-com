"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// MACRS折旧率表（基于IRS Publication 946）
const MACRS_RATES = {
  "3": {
    "200DB": [0.3333, 0.4445, 0.1481, 0.0741],
    "150DB": [0.25, 0.375, 0.25, 0.125],
    "SL": [0.1667, 0.3333, 0.3333, 0.1667]
  },
  "5": {
    "200DB": [0.2, 0.32, 0.192, 0.1152, 0.1152, 0.0576],
    "150DB": [0.15, 0.255, 0.1785, 0.1665, 0.1665, 0.0835],
    "SL": [0.1, 0.2, 0.2, 0.2, 0.2, 0.1]
  },
  "7": {
    "200DB": [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446],
    "150DB": [0.1071, 0.1918, 0.1532, 0.1379, 0.1243, 0.1116, 0.1116, 0.0558],
    "SL": [0.0714, 0.1429, 0.1429, 0.1429, 0.1429, 0.1429, 0.1429, 0.0712]
  },
  "10": {
    "200DB": [0.1, 0.18, 0.144, 0.1152, 0.0922, 0.0737, 0.0655, 0.0655, 0.0656, 0.0655, 0.0328],
    "150DB": [0.075, 0.1388, 0.1249, 0.1124, 0.1011, 0.091, 0.0819, 0.0737, 0.0655, 0.0655, 0.0328],
    "SL": [0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05]
  },
  "15": {
    "150DB": [0.05, 0.095, 0.0855, 0.077, 0.0693, 0.0623, 0.059, 0.059, 0.0591, 0.059, 0.0591, 0.059, 0.0591, 0.059, 0.0591, 0.0295],
    "SL": [0.0333, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0667, 0.0333]
  },
  "20": {
    "150DB": [0.0375, 0.07219, 0.06677, 0.06177, 0.05713, 0.05285, 0.04888, 0.04522, 0.04462, 0.04461, 0.04462, 0.04461, 0.04462, 0.04461, 0.04462, 0.04461, 0.04462, 0.04461, 0.04462, 0.04461, 0.02231],
    "SL": [0.025, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.025]
  },
  "27.5": {
    "SL": Array(28).fill(0.03636).map((v, i) => i === 0 ? 0.01515 : i === 27 ? 0.01515 : v)
  },
  "39": {
    "SL": Array(40).fill(0.02564).map((v, i) => i === 0 ? 0.01071 : i === 39 ? 0.01071 : v)
  }
};

interface DepreciationResult {
  year: number;
  rate: number;
  depreciation: number;
  accumulated: number;
  bookValue: number;
}

export default function Home() {
  const [basis, setBasis] = useState("50000");
  const [businessUsage, setBusinessUsage] = useState("100");
  const [salvageValue, setSalvageValue] = useState("0");
  const [recoveryPeriod, setRecoveryPeriod] = useState("5");
  const [method, setMethod] = useState("200DB");
  const [convention, setConvention] = useState("Half-Year");
  const [placedInService, setPlacedInService] = useState("2025-01-01");
  const [results, setResults] = useState<DepreciationResult[]>([]);

  const calculateDepreciation = () => {
    const basisValue = Number.parseFloat(basis);
    const businessPct = Number.parseFloat(businessUsage) / 100;
    const salvageVal = Number.parseFloat(salvageValue);
    const depreciableBasis = basisValue * businessPct;

    // MACRS通常不考虑残值，但如果用户输入了残值，我们会在最后调整
    const rateKey = recoveryPeriod as keyof typeof MACRS_RATES;
    let rates: number[] = [];

    // 获取折旧率
    if (MACRS_RATES[rateKey]) {
      const methodRates = MACRS_RATES[rateKey] as Record<string, number[]>;
      if (methodRates[method]) {
        rates = methodRates[method];
      } else if (methodRates.SL) {
        rates = methodRates.SL;
      }
    }

    if (rates.length === 0) {
      alert("无效的恢复期或折旧方法组合");
      return;
    }

    const depreciationSchedule: DepreciationResult[] = [];
    let accumulatedDepreciation = 0;

    for (let i = 0; i < rates.length; i++) {
      let yearDepreciation = depreciableBasis * rates[i];
      accumulatedDepreciation += yearDepreciation;

      // 确保累计折旧不超过（可折旧基础 - 残值）
      const maxDepreciation = depreciableBasis - salvageVal;
      if (accumulatedDepreciation > maxDepreciation) {
        const excess = accumulatedDepreciation - maxDepreciation;
        yearDepreciation -= excess;
        accumulatedDepreciation = maxDepreciation;
      }

      const bookValue = depreciableBasis - accumulatedDepreciation;

      depreciationSchedule.push({
        year: i + 1,
        rate: rates[i] * 100,
        depreciation: yearDepreciation,
        accumulated: accumulatedDepreciation,
        bookValue: Math.max(salvageVal, bookValue)
      });

      // 如果已经达到残值，停止折旧
      if (accumulatedDepreciation >= maxDepreciation) {
        break;
      }
    }

    setResults(depreciationSchedule);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">MACRS Depreciation Calculator</h1>
          <p className="text-slate-600">Modified Accelerated Cost Recovery System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>
              Enter asset information to calculate MACRS depreciation schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="basis">Asset Basis</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <Input
                    id="basis"
                    type="number"
                    value={basis}
                    onChange={(e) => setBasis(e.target.value)}
                    className="pl-7"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessUsage">Business Use Percentage</Label>
                <div className="relative">
                  <Input
                    id="businessUsage"
                    type="number"
                    value={businessUsage}
                    onChange={(e) => setBusinessUsage(e.target.value)}
                    className="pr-7"
                    placeholder="100"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salvageValue">Salvage Value</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <Input
                    id="salvageValue"
                    type="number"
                    value={salvageValue}
                    onChange={(e) => setSalvageValue(e.target.value)}
                    className="pl-7"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Note: MACRS typically assumes $0 salvage value, but you can enter an estimated value
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recoveryPeriod">Recovery Period</Label>
                <Select value={recoveryPeriod} onValueChange={setRecoveryPeriod}>
                  <SelectTrigger id="recoveryPeriod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3-Year</SelectItem>
                    <SelectItem value="5">5-Year</SelectItem>
                    <SelectItem value="7">7-Year</SelectItem>
                    <SelectItem value="10">10-Year</SelectItem>
                    <SelectItem value="15">15-Year</SelectItem>
                    <SelectItem value="20">20-Year</SelectItem>
                    <SelectItem value="27.5">27.5-Year (Residential Rental)</SelectItem>
                    <SelectItem value="39">39-Year (Nonresidential Real Property)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Depreciation Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="200DB">200% Declining Balance (GDS)</SelectItem>
                    <SelectItem value="150DB">150% Declining Balance (GDS)</SelectItem>
                    <SelectItem value="SL">Straight Line (SL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="convention">Convention</Label>
                <Select value={convention} onValueChange={setConvention}>
                  <SelectTrigger id="convention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Half-Year">Half-Year Convention</SelectItem>
                    <SelectItem value="Mid-Quarter">Mid-Quarter Convention</SelectItem>
                    <SelectItem value="Mid-Month">Mid-Month Convention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placedInService">Date Placed in Service</Label>
                <Input
                  id="placedInService"
                  type="date"
                  value={placedInService}
                  onChange={(e) => setPlacedInService(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculateDepreciation} className="w-full md:w-auto" size="lg">
              Calculate Depreciation
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>折旧计划表</CardTitle>
              <CardDescription>
                详细的年度折旧明细
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">年份</TableHead>
                      <TableHead className="text-right">折旧率</TableHead>
                      <TableHead className="text-right">年度折旧</TableHead>
                      <TableHead className="text-right">累计折旧</TableHead>
                      <TableHead className="text-right">账面价值</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.year}>
                        <TableCell className="text-center font-medium">{result.year}</TableCell>
                        <TableCell className="text-right">{formatPercent(result.rate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(result.depreciation)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(result.accumulated)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(result.bookValue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-2">
                <h3 className="font-semibold text-slate-900">汇总信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">原始成本：</span>
                    <span className="font-semibold ml-2">{formatCurrency(Number.parseFloat(basis))}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">可折旧基础：</span>
                    <span className="font-semibold ml-2">
                      {formatCurrency(Number.parseFloat(basis) * (Number.parseFloat(businessUsage) / 100))}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">残值：</span>
                    <span className="font-semibold ml-2">{formatCurrency(Number.parseFloat(salvageValue))}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">总折旧：</span>
                    <span className="font-semibold ml-2">
                      {formatCurrency(results[results.length - 1]?.accumulated || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">关于 MACRS 折旧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-800">
            <p>
              <strong>MACRS (修正加速成本回收系统)</strong> 是美国联邦所得税用于确定折旧扣除的主要方法。
            </p>
            <p>
              <strong>折旧方法：</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>200% 余额递减法 (GDS)</strong>：在前几年提供最高的税收扣除</li>
              <li><strong>150% 余额递减法 (GDS)</strong>：提供比直线法更高但比200%方法更低的扣除</li>
              <li><strong>直线法 (SL)</strong>：每年扣除相同金额（除第一年和最后一年）</li>
            </ul>
            <p>
              <strong>恢复期示例：</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>3年：某些拖拉机、马匹</li>
              <li>5年：汽车、计算机、办公设备</li>
              <li>7年：办公家具、农业机械</li>
              <li>27.5年：住宅租赁房地产</li>
              <li>39年：非住宅房地产</li>
            </ul>
            <p className="mt-3">
              <strong>关于残值：</strong>根据MACRS规则，折旧计算通常假设残值为$0。但是，此计算器允许您输入估计残值，以便更准确地反映资产的实际价值。当输入残值后，折旧将在账面价值达到残值时停止。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
