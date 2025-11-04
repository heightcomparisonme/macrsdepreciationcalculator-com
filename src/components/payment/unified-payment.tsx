"use client";

import React, { useState } from "react";
import { PaymentProviderSelector, QuickPaymentButton, PaymentProvider } from "./provider-selector";
import { PayPalProvider, PayPalSubscribeButton } from "@/components/paypal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface UnifiedPaymentProps {
  productId: string;
  productName: string;
  price: number;
  currency: string;
  locale?: string;
  interval?: "month" | "year" | "one-time";
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

export function UnifiedPayment({
  productId,
  productName,
  price,
  currency,
  locale = "en",
  interval = "month",
  onSuccess,
  onError,
  className = "",
}: UnifiedPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("stripe");
  const [step, setStep] = useState<"select" | "pay">("select");

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    setStep("pay");
  };

  const handleBackToSelection = () => {
    setStep("select");
  };

  const handlePaymentSuccess = (result: any) => {
    console.log("Payment successful:", result);
    onSuccess?.(result);
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment failed:", error);
    onError?.(error);
  };

  const renderPaymentComponent = () => {
    switch (selectedProvider) {
      case "paypal":
        return (
          <PayPalProvider>
            <PayPalSubscribeButton
              planId={productId}
              planName={productName}
              price={price}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
          </PayPalProvider>
        );

      case "stripe":
      case "creem":
        return (
          <QuickPaymentButton
            provider={selectedProvider}
            productId={productId}
            currency={currency}
            locale={locale}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            className="w-full"
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">不支持的支付提供商</p>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {step === "select" ? (
        <PaymentProviderSelector
          onProviderSelect={handleProviderSelect}
          selectedProvider={selectedProvider}
          currency={currency}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">完成支付</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSelection}
              >
                ← 返回选择
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 订单信息 */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">订单详情</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>产品:</span>
                  <span>{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span>价格:</span>
                  <span className="font-medium">
                    {currency} {price.toFixed(2)}{" "}
                    {interval !== "one-time" && `/ ${interval}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>支付方式:</span>
                  <span className="capitalize">{selectedProvider}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* 支付组件 */}
            <div>
              <h4 className="font-medium mb-4">使用 {selectedProvider} 支付</h4>
              {renderPaymentComponent()}
            </div>

            {/* 安全提示 */}
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>🔒 您的支付信息通过SSL加密传输</p>
              <p>💳 支持主流信用卡和在线支付方式</p>
              <p>✅ 可随时取消订阅，无隐藏费用</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 简化版支付组件，直接显示所有支付选项
interface SimplePaymentOptionsProps {
  productId: string;
  productName: string;
  price: number;
  currency: string;
  locale?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

export function SimplePaymentOptions({
  productId,
  productName,
  price,
  currency,
  locale = "en",
  onSuccess,
  onError,
  className = "",
}: SimplePaymentOptionsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg mb-2">{productName}</h3>
        <p className="text-2xl font-bold text-primary">
          {currency} {price.toFixed(2)}
        </p>
      </div>

      <div className="grid gap-3">
        {/* Stripe支付 */}
        <QuickPaymentButton
          provider="stripe"
          productId={productId}
          currency={currency}
          locale={locale}
          onSuccess={onSuccess}
          onError={onError}
          className="w-full"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>💳</span>
            <span>信用卡支付 (Stripe)</span>
          </div>
        </QuickPaymentButton>

        {/* PayPal支付 */}
        <PayPalProvider>
          <PayPalSubscribeButton
            planId={productId}
            planName={productName}
            price={price}
            currency={currency}
            onSuccess={onSuccess}
            onError={onError}
            className="w-full"
            style={{
              layout: "horizontal",
              color: "blue",
              shape: "rect",
              label: "subscribe",
              height: 48,
            }}
          />
        </PayPalProvider>

        {/* Creem支付 */}
        <QuickPaymentButton
          provider="creem"
          productId={productId}
          currency={currency}
          locale={locale}
          onSuccess={onSuccess}
          onError={onError}
          className="w-full"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>🔄</span>
            <span>订阅支付 (Creem)</span>
          </div>
        </QuickPaymentButton>
      </div>
    </div>
  );
}

