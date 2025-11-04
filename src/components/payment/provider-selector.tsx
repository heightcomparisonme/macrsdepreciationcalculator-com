"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type PaymentProvider = "stripe" | "paypal" | "creem";

interface PaymentProviderOption {
  id: PaymentProvider;
  name: string;
  description: string;
  logo?: string;
  features: string[];
  supported_currencies: string[];
  enabled: boolean;
}

interface PaymentProviderSelectorProps {
  onProviderSelect: (provider: PaymentProvider) => void;
  selectedProvider?: PaymentProvider;
  currency?: string;
  className?: string;
}

const paymentProviders: PaymentProviderOption[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "全球领先的在线支付平台，支持信用卡、借记卡等多种支付方式",
    features: ["信用卡支付", "借记卡支付", "Apple Pay", "Google Pay", "微信支付(部分地区)"],
    supported_currencies: ["USD", "EUR", "CNY", "GBP", "JPY"],
    enabled: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "全球知名的数字支付平台，支持PayPal账户和信用卡支付",
    features: ["PayPal账户", "信用卡支付", "银行转账", "PayPal Credit"],
    supported_currencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
    enabled: true,
  },
  {
    id: "creem",
    name: "Creem",
    description: "专业的订阅支付解决方案，支持灵活的计费模式",
    features: ["订阅支付", "灵活计费", "自动续费", "多币种支持"],
    supported_currencies: ["USD", "EUR"],
    enabled: true,
  },
];

export function PaymentProviderSelector({
  onProviderSelect,
  selectedProvider,
  currency = "USD",
  className = "",
}: PaymentProviderSelectorProps) {
  // 过滤支持当前货币的支付提供商
  const availableProviders = paymentProviders.filter(
    (provider) => provider.enabled && provider.supported_currencies.includes(currency)
  );

  if (availableProviders.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">暂无支持 {currency} 的支付方式</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">选择支付方式</h3>
        <p className="text-muted-foreground text-sm">
          请选择您偏好的支付方式完成订阅
        </p>
      </div>

      <div className="grid gap-4">
        {availableProviders.map((provider) => (
          <Card
            key={provider.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedProvider === provider.id
                ? "ring-2 ring-primary border-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onProviderSelect(provider.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {provider.description}
                    </CardDescription>
                  </div>
                </div>
                {selectedProvider === provider.id && (
                  <Badge variant="default" className="bg-primary">
                    已选择
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    支持的支付方式:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    支持货币:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {provider.supported_currencies.map((curr) => (
                      <Badge
                        key={curr}
                        variant={curr === currency ? "default" : "outline"}
                        className="text-xs"
                      >
                        {curr}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProvider && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            ✓ 已选择{" "}
            <span className="font-medium">
              {availableProviders.find((p) => p.id === selectedProvider)?.name}
            </span>{" "}
            作为支付方式
          </p>
        </div>
      )}
    </div>
  );
}

// 快速支付按钮组件
interface QuickPaymentButtonProps {
  provider: PaymentProvider;
  productId: string;
  currency: string;
  locale?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function QuickPaymentButton({
  provider,
  productId,
  currency,
  locale = "en",
  onSuccess,
  onError,
  disabled = false,
  className = "",
  children,
}: QuickPaymentButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          currency: currency.toLowerCase(),
          locale,
          provider, // 传递选择的支付提供商
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment failed");
      }

      const result = await response.json();
      
      // 重定向到支付页面
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        onSuccess?.(result);
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const providerConfig = paymentProviders.find((p) => p.id === provider);

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={className}
      size="lg"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          处理中...
        </>
      ) : (
        children || `使用 ${providerConfig?.name} 支付`
      )}
    </Button>
  );
}

