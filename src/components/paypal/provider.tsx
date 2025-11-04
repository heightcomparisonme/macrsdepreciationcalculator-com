"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PayPalContextType {
  paypalLoaded: boolean;
  paypalError: string | null;
}

const PayPalContext = createContext<PayPalContextType>({
  paypalLoaded: false,
  paypalError: null,
});

export const usePayPal = () => useContext(PayPalContext);

interface PayPalProviderProps {
  children: React.ReactNode;
  clientId?: string;
  currency?: string;
  locale?: string;
}

export function PayPalProvider({
  children,
  clientId,
  currency = "USD",
  locale = "en_US",
}: PayPalProviderProps) {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        // Check if PayPal SDK is already loaded
        if (window.paypal) {
          setPaypalLoaded(true);
          return;
        }

        const paypalClientId = clientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        if (!paypalClientId) {
          throw new Error("PayPal Client ID is not configured");
        }

        // Create script element
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription&currency=${currency}&locale=${locale}`;
        script.async = true;

        // Handle script load
        script.onload = () => {
          setPaypalLoaded(true);
          setPaypalError(null);
        };

        script.onerror = () => {
          setPaypalError("Failed to load PayPal SDK");
          setPaypalLoaded(false);
        };

        // Add script to document
        document.head.appendChild(script);

        // Cleanup function
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      } catch (error) {
        setPaypalError(error instanceof Error ? error.message : "Unknown error");
        setPaypalLoaded(false);
      }
    };

    loadPayPalScript();
  }, [clientId, currency, locale]);

  return (
    <PayPalContext.Provider value={{ paypalLoaded, paypalError }}>
      {children}
    </PayPalContext.Provider>
  );
}

// TypeScript declaration for PayPal SDK
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createSubscription: (data: any, actions: any) => Promise<string>;
        onApprove: (data: any, actions: any) => void;
        onError?: (err: any) => void;
        onCancel?: () => void;
        style?: {
          layout?: string;
          color?: string;
          shape?: string;
          label?: string;
          height?: number;
        };
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

