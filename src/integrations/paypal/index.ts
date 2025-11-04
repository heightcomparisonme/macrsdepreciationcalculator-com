export class PayPalClient {
  private config: {
    clientId: string;
    clientSecret: string;
    apiBase: string;
    webhookId?: string;
  };

  constructor({
    clientId,
    clientSecret,
    env,
    webhookId,
  }: {
    clientId?: string;
    clientSecret?: string;
    env?: "sandbox" | "production";
    webhookId?: string;
  }) {
    if (!clientId) {
      clientId = process.env.PAYPAL_CLIENT_ID;
      if (!clientId) {
        throw new Error("PAYPAL_CLIENT_ID is not set");
      }
    }

    if (!clientSecret) {
      clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      if (!clientSecret) {
        throw new Error("PAYPAL_CLIENT_SECRET is not set");
      }
    }

    if (!env) {
      env = process.env.PAYPAL_ENV as "sandbox" | "production" | undefined;
      if (!env) {
        env = process.env.NODE_ENV === "production" ? "production" : "sandbox";
      }
    }

    if (!webhookId) {
      webhookId = process.env.PAYPAL_WEBHOOK_ID;
    }

    this.config = {
      clientId,
      clientSecret,
      apiBase:
        env === "production"
          ? "https://api-m.paypal.com"
          : "https://api-m.sandbox.paypal.com",
      webhookId,
    };
  }

  clientId() {
    return this.config.clientId;
  }

  clientSecret() {
    return this.config.clientSecret;
  }

  apiBase() {
    return this.config.apiBase;
  }

  webhookId() {
    return this.config.webhookId;
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString("base64");

    const response = await fetch(`${this.config.apiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get PayPal access token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  }

  async createProduct(productData: {
    name: string;
    description?: string;
    type?: "SERVICE" | "DIGITAL_GOODS" | "PHYSICAL_GOODS";
    category?: string;
    image_url?: string;
    home_url?: string;
  }) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.config.apiBase}/v1/catalogs/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `PRODUCT-${Date.now()}`,
      },
      body: JSON.stringify({
        type: "SERVICE",
        category: "SOFTWARE",
        ...productData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create PayPal product: ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  }

  async createPlan(planData: {
    product_id: string;
    name: string;
    description?: string;
    billing_cycles: Array<{
      frequency: {
        interval_unit: "DAY" | "WEEK" | "MONTH" | "YEAR";
        interval_count: number;
      };
      tenure_type: "TRIAL" | "REGULAR";
      sequence: number;
      total_cycles?: number;
      pricing_scheme?: {
        fixed_price: {
          value: string;
          currency_code: string;
        };
      };
    }>;
    payment_preferences?: {
      auto_bill_outstanding?: boolean;
      setup_fee?: {
        value: string;
        currency_code: string;
      };
      setup_fee_failure_action?: "CONTINUE" | "CANCEL";
      payment_failure_threshold?: number;
    };
    taxes?: {
      percentage: string;
      inclusive: boolean;
    };
  }) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.config.apiBase}/v1/billing/plans`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `PLAN-${Date.now()}`,
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create PayPal plan: ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  }

  async createSubscription(
    planId: string,
    userId: string,
    customData?: Record<string, any>
  ) {
    const accessToken = await this.getAccessToken();

    const subscriptionPayload = {
      plan_id: planId,
      custom_id: userId,
      application_context: {
        brand_name: process.env.NEXT_PUBLIC_PROJECT_NAME || "Your App",
        locale: "en-US",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXT_PUBLIC_WEB_URL}/api/pay/callback/paypal`,
        cancel_url: `${process.env.NEXT_PUBLIC_PAY_CANCEL_URL || process.env.NEXT_PUBLIC_WEB_URL}`,
      },
      ...customData,
    };

    const response = await fetch(
      `${this.config.apiBase}/v1/billing/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id": `SUBSCRIPTION-${Date.now()}-${userId}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(subscriptionPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create PayPal subscription: ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  }

  async getSubscription(subscriptionId: string) {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${this.config.apiBase}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to get PayPal subscription: ${JSON.stringify(errorData)}`
      );
    }

    return await response.json();
  }

  async verifyWebhookSignature(
    rawBody: string,
    headers: {
      "paypal-auth-algo"?: string;
      "paypal-cert-url"?: string;
      "paypal-transmission-id"?: string;
      "paypal-transmission-sig"?: string;
      "paypal-transmission-time"?: string;
    }
  ): Promise<boolean> {
    if (!this.config.webhookId) {
      throw new Error("PayPal Webhook ID is required for signature verification");
    }

    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${this.config.apiBase}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: headers["paypal-auth-algo"],
          cert_url: headers["paypal-cert-url"],
          transmission_id: headers["paypal-transmission-id"],
          transmission_sig: headers["paypal-transmission-sig"],
          transmission_time: headers["paypal-transmission-time"],
          webhook_id: this.config.webhookId,
          webhook_event: JSON.parse(rawBody),
        }),
      }
    );

    if (!response.ok) {
      console.error("PayPal webhook verification API failed:", response.status);
      return false;
    }

    const verifyResult = await response.json();
    return verifyResult.verification_status === "SUCCESS";
  }
}

export function newPayPalClient({
  clientId,
  clientSecret,
  env,
  webhookId,
}: {
  clientId?: string;
  clientSecret?: string;
  env?: "sandbox" | "production";
  webhookId?: string;
} = {}): PayPalClient {
  return new PayPalClient({
    clientId,
    clientSecret,
    env,
    webhookId,
  });
}

