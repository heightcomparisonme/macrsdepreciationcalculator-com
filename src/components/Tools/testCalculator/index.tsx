"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function TestCalculator() {
  const t = useTranslations("tools.test-calculator");
  const [number1, setNumber1] = useState("10");
  const [number2, setNumber2] = useState("5");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);
    if (!isNaN(num1) && !isNaN(num2)) {
      setResult(num1 + num2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-slate-600">{t("subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("input.title")}</CardTitle>
            <CardDescription>{t("input.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="number1">{t("input.number1")}</Label>
                <Input
                  id="number1"
                  type="number"
                  value={number1}
                  onChange={(e) => setNumber1(e.target.value)}
                  placeholder="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number2">{t("input.number2")}</Label>
                <Input
                  id="number2"
                  type="number"
                  value={number2}
                  onChange={(e) => setNumber2(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full md:w-auto" size="lg">
              {t("button.calculate")}
            </Button>
          </CardContent>
        </Card>

        {result !== null && (
          <Card>
            <CardHeader>
              <CardTitle>{t("result.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-lg text-slate-600">{t("result.description")}</p>
                <p className="text-5xl font-bold text-blue-600 mt-4">{result}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">{t("info.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p>{t("info.description")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
