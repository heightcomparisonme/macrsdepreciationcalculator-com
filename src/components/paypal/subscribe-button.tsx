"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePayPal } from "./provider";
import { Button } from "@/components/ui/button";

interface PayPalSubscribeButtonProps {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
  style?: {
    layout?: "vertical" | "horizontal";
    color?: "gold" | "blue" | "silver" | "white" | "black";
    shape?: "rect" | "pill";
    label?: "paypal" | "checkout" | "buynow" | "pay" | "installment" | "subscribe";
    height?: number;
  };
}

export function PayPalSubscribeButton({
  planId,
  planName,
  price,
  currency,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  className = "",
  style = {
    layout: "vertical",
    color: "gold",
    shape: "rect",
    label: "subscribe",
    height: 50,
  },
}: PayPalSubscribeButtonProps) {
  const { paypalLoaded, paypalError } = usePayPal();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !paypalLoaded || !window.paypal || !buttonRef.current || disabled) {
      return;
    }

    // Clear existing PayPal button
    if (buttonRef.current) {
      buttonRef.current.innerHTML = "";
    }

    try {
      window.paypal
        .Buttons({
          style,
          createSubscription: async (data, actions) => {
            setIsProcessing(true);

            try {
              // Call our backend API to create subscription
              const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  product_id: planId,
                  currency: currency.toLowerCase(),
                  locale: "en",
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create subscription");
              }

              const subscriptionData = await response.json();
              
              // Return the subscription ID for PayPal to process
              return subscriptionData.session_id || subscriptionData.subscription_id;
            } catch (error) {
              console.error("Create subscription error:", error);
              onError?.(error);
              throw error;
            } finally {
              setIsProcessing(false);
            }
          },
          onApprove: async (data, actions) => {
            console.log("PayPal subscription approved:", data.subscriptionID);
            onSuccess?.(data.subscriptionID);
          },
          onError: (err) => {
            console.error("PayPal subscription error:", err);
            setIsProcessing(false);
            onError?.(err);
          },
          onCancel: () => {
            console.log("PayPal subscription cancelled");
            setIsProcessing(false);
            onCancel?.();
          },
        })
        .render(buttonRef.current);
    } catch (error) {
      console.error("Failed to render PayPal button:", error);
      onError?.(error);
    }
  }, [mounted, paypalLoaded, disabled, planId, currency, onSuccess, onError, onCancel, style]);

  if (!mounted) {
    return null;
  }

  if (paypalError) {
    return (
      <Button
        disabled
        className={`w-full bg-red-300 text-red-600 cursor-not-allowed ${className}`}
      >
        PayPal Error: {paypalError}
      </Button>
    );
  }

  if (!paypalLoaded || isProcessing) {
    return (
      <Button
        disabled
        className={`w-full bg-gray-300 text-gray-600 cursor-not-allowed ${className}`}
      >
        {isProcessing ? "Processing..." : "Loading PayPal..."}
      </Button>
    );
  }

  if (disabled) {
    return (
      <Button
        disabled
        className={`w-full bg-gray-300 text-gray-600 cursor-not-allowed ${className}`}
      >
        Unavailable
      </Button>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg">{planName}</h3>
        <p className="text-2xl font-bold text-blue-600">
          {currency} {price.toFixed(2)}
        </p>
      </div>
      <div ref={buttonRef} className="w-full" />
    </div>
  );
}

