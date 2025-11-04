"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// MACRS depreciation rate table (based on IRS Publication 946)
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
  const t = useTranslations("tools.test-calculator");

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

    // MACRS typically does not consider salvage value, but if the user enters a salvage value, we adjust it at the end
    const rateKey = recoveryPeriod as keyof typeof MACRS_RATES;
    let rates: number[] = [];

    // Get depreciation rates
    if (MACRS_RATES[rateKey]) {
      const methodRates = MACRS_RATES[rateKey] as Record<string, number[]>;
      if (methodRates[method]) {
        rates = methodRates[method];
      } else if (methodRates.SL) {
        rates = methodRates.SL;
      }
    }

    if (rates.length === 0) {
      alert(t("alerts.invalid_combination"));
      return;
    }

    const depreciationSchedule: DepreciationResult[] = [];
    let accumulatedDepreciation = 0;

    for (let i = 0; i < rates.length; i++) {
      let yearDepreciation = depreciableBasis * rates[i];
      accumulatedDepreciation += yearDepreciation;

      // Ensure accumulated depreciation does not exceed (depreciable basis - salvage value)
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

      // Stop depreciation when salvage value is reached
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
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-slate-600">{t("subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("input.title")}</CardTitle>
            <CardDescription>
              {t("input.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="basis">{t("input.basis.label")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <Input
                    id="basis"
                    type="number"
                    value={basis}
                    onChange={(e) => setBasis(e.target.value)}
                    className="pl-7"
                    placeholder={t("input.basis.placeholder")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessUsage">{t("input.business_usage.label")}</Label>
                <div className="relative">
                  <Input
                    id="businessUsage"
                    type="number"
                    value={businessUsage}
                    onChange={(e) => setBusinessUsage(e.target.value)}
                    className="pr-7"
                    placeholder={t("input.business_usage.placeholder")}
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salvageValue">{t("input.salvage_value.label")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <Input
                    id="salvageValue"
                    type="number"
                    value={salvageValue}
                    onChange={(e) => setSalvageValue(e.target.value)}
                    className="pl-7"
                    placeholder={t("input.salvage_value.placeholder")}
                    min="0"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {t("input.salvage_value.note")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recoveryPeriod">{t("input.recovery_period.label")}</Label>
                <Select value={recoveryPeriod} onValueChange={setRecoveryPeriod}>
                  <SelectTrigger id="recoveryPeriod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">{t("input.recovery_period.options.3")}</SelectItem>
                    <SelectItem value="5">{t("input.recovery_period.options.5")}</SelectItem>
                    <SelectItem value="7">{t("input.recovery_period.options.7")}</SelectItem>
                    <SelectItem value="10">{t("input.recovery_period.options.10")}</SelectItem>
                    <SelectItem value="15">{t("input.recovery_period.options.15")}</SelectItem>
                    <SelectItem value="20">{t("input.recovery_period.options.20")}</SelectItem>
                    <SelectItem value="27.5">{t("input.recovery_period.options.27_5")}</SelectItem>
                    <SelectItem value="39">{t("input.recovery_period.options.39")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">{t("input.method.label")}</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="200DB">{t("input.method.options.200DB")}</SelectItem>
                    <SelectItem value="150DB">{t("input.method.options.150DB")}</SelectItem>
                    <SelectItem value="SL">{t("input.method.options.SL")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="convention">{t("input.convention.label")}</Label>
                <Select value={convention} onValueChange={setConvention}>
                  <SelectTrigger id="convention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Half-Year">{t("input.convention.options.half_year")}</SelectItem>
                    <SelectItem value="Mid-Quarter">{t("input.convention.options.mid_quarter")}</SelectItem>
                    <SelectItem value="Mid-Month">{t("input.convention.options.mid_month")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placedInService">{t("input.placed_in_service.label")}</Label>
                <Input
                  id="placedInService"
                  type="date"
                  value={placedInService}
                  onChange={(e) => setPlacedInService(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculateDepreciation} className="w-full md:w-auto" size="lg">
              {t("button.calculate")}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("results.title")}</CardTitle>
              <CardDescription>
                {t("results.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">{t("results.table.year")}</TableHead>
                      <TableHead className="text-right">{t("results.table.rate")}</TableHead>
                      <TableHead className="text-right">{t("results.table.depreciation")}</TableHead>
                      <TableHead className="text-right">{t("results.table.accumulated")}</TableHead>
                      <TableHead className="text-right">{t("results.table.book_value")}</TableHead>
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
                <h3 className="font-semibold text-slate-900">{t("results.summary.title")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">{t("results.summary.original_cost")}</span>
                    <span className="font-semibold ml-2">{formatCurrency(Number.parseFloat(basis))}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">{t("results.summary.depreciable_basis")}</span>
                    <span className="font-semibold ml-2">
                      {formatCurrency(Number.parseFloat(basis) * (Number.parseFloat(businessUsage) / 100))}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">{t("results.summary.salvage_value")}</span>
                    <span className="font-semibold ml-2">{formatCurrency(Number.parseFloat(salvageValue))}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">{t("results.summary.total_depreciation")}</span>
                    <span className="font-semibold ml-2">
                      {formatCurrency(results[results.length - 1]?.accumulated || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">{t("info.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>{t("info.title")}</strong> {t("info.description")}
            </p>
            <p>
              <strong>{t("info.methods.title")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>200% Declining Balance (GDS)</strong>: {t("info.methods.200DB")}</li>
              <li><strong>150% Declining Balance (GDS)</strong>: {t("info.methods.150DB")}</li>
              <li><strong>Straight Line (SL)</strong>: {t("info.methods.SL")}</li>
            </ul>
            <p>
              <strong>{t("info.recovery_examples.title")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>{t("info.recovery_examples.3_year")}</li>
              <li>{t("info.recovery_examples.5_year")}</li>
              <li>{t("info.recovery_examples.7_year")}</li>
              <li>{t("info.recovery_examples.27_5_year")}</li>
              <li>{t("info.recovery_examples.39_year")}</li>
            </ul>
            <p className="mt-3">
              <strong>{t("info.salvage_note.title")}</strong> {t("info.salvage_note.description")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
