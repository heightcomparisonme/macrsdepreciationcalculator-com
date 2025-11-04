import { getUserEmail, getUserUuid } from "@/services/user";
import { insertOrder, OrderStatus, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/lib/resp";

import Stripe from "stripe";
import { findUserByUuid } from "@/models/user";
import { getSnowId } from "@/lib/hash";
import { getPricingPage } from "@/services/page";
import { PricingItem } from "@/types/blocks/pricing";
import { newStripeClient } from "@/integrations/stripe";
import { Order } from "@/types/order";
import { newCreemClient } from "@/integrations/creem";
import { newPayPalClient } from "@/integrations/paypal";

export async function POST(req: Request) {
  try {
    const { product_id, currency, locale, provider: requestProvider } = await req.json();

    let cancel_url = `${
      process.env.NEXT_PUBLIC_PAY_CANCEL_URL || process.env.NEXT_PUBLIC_WEB_URL
    }`;
    if (cancel_url && cancel_url.startsWith("/")) {
      // relative url
      cancel_url = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}${cancel_url}`;
    }

    if (!product_id) {
      return respErr("invalid params");
    }

    // validate checkout params
    const page = await getPricingPage(locale);
    if (!page || !page.pricing || !page.pricing.items) {
      return respErr("invalid pricing table");
    }

    const item = page.pricing.items.find(
      (item: PricingItem) => item.product_id === product_id
    );

    if (!item || !item.amount || !item.interval || !item.currency) {
      return respErr("invalid checkout params");
    }

    const { amount: itemAmount, interval, valid_months, credits, product_name } = item;
    let amount = itemAmount;
    let finalCurrency = currency;

    if (!["year", "month", "one-time"].includes(interval)) {
      return respErr("invalid interval");
    }

    if (interval === "year" && valid_months !== 12) {
      return respErr("invalid valid_months");
    }

    if (interval === "month" && valid_months !== 1) {
      return respErr("invalid valid_months");
    }

    if (finalCurrency === "cny") {
      if (!item.cn_amount) {
        return respErr("invalid checkout params: cn_amount");
      }
      amount = item.cn_amount;
    } else {
      finalCurrency = item.currency;
    }

    const is_subscription = interval === "month" || interval === "year";

    // get signed user
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth, please sign-in");
    }

    let user_email = await getUserEmail();
    if (!user_email) {
      const user = await findUserByUuid(user_uuid);
      if (user) {
        user_email = user.email;
      }
    }
    if (!user_email) {
      return respErr("invalid user");
    }

    // generate order_no
    const order_no = getSnowId();

    const currentDate = new Date();
    const created_at = currentDate.toISOString();

    // calculate expired_at
    let expired_at = "";
    if (valid_months && valid_months > 0) {
      const timePeriod = new Date(currentDate);
      timePeriod.setMonth(currentDate.getMonth() + valid_months);

      const timePeriodMillis = timePeriod.getTime();
      let delayTimeMillis = 0;

      // subscription
      if (is_subscription) {
        delayTimeMillis = 24 * 60 * 60 * 1000; // delay 24 hours expired
      }

      const newTimeMillis = timePeriodMillis + delayTimeMillis;
      const newDate = new Date(newTimeMillis);

      expired_at = newDate.toISOString();
    }

    // create order
    const order = {
      order_no: order_no,
      created_at: new Date(created_at),
      user_uuid: user_uuid,
      user_email: user_email,
      amount: amount,
      interval: interval,
      expired_at: expired_at ? new Date(expired_at) : null,
      status: OrderStatus.Created,
      credits: credits || 0,
      currency: finalCurrency,
      product_id: product_id,
      product_name: product_name,
      valid_months: valid_months,
    };
    await insertOrder(order);

    // 支持动态选择支付提供商，优先使用请求参数，然后是环境变量，最后默认stripe
    const provider = requestProvider || process.env.PAY_PROVIDER || "stripe";
    
    // 验证支付提供商是否有效
    const validProviders = ["stripe", "paypal", "creem"];
    if (!validProviders.includes(provider)) {
      return respErr(`Invalid payment provider: ${provider}. Valid options: ${validProviders.join(", ")}`);
    }

    if (provider === "creem") {
      // checkout with creem
      const result = await creemCheckout({
        order: order as Order,
        locale,
        cancel_url,
      });

      return respData(result);
    }

    if (provider === "paypal") {
      // checkout with paypal
      const result = await paypalCheckout({
        order: order as Order,
        locale,
        cancel_url,
      });

      return respData(result);
    }

    // checkout with stripe (default)
    const result = await stripeCheckout({
      order: order as Order,
      locale,
      cancel_url,
    });

    return respData(result);
  } catch (e: unknown) {
    const error = e as Error;
    console.log("checkout failed: ", e);
    return respErr("checkout failed: " + error.message);
  }
}

async function stripeCheckout({
  order,
  locale,
  cancel_url,
}: {
  order: Order;
  locale: string;
  cancel_url: string;
}) {
  const intervals = ["month", "year"];
  const is_subscription = intervals.includes(order.interval);

  const client = newStripeClient();

  const options: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: order.currency,
          product_data: {
            name: order.product_name || "",
          },
          unit_amount: order.amount,
          recurring: is_subscription
            ? {
                interval: order.interval as "month" | "year",
              }
            : undefined,
        },
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    metadata: {
      project: process.env.NEXT_PUBLIC_PROJECT_NAME || "",
      product_name: order.product_name || "",
      order_no: order.order_no,
      user_email: order.user_email,
      credits: order.credits,
      user_uuid: order.user_uuid,
    },
    mode: is_subscription ? "subscription" : "payment",
    success_url: `${process.env.NEXT_PUBLIC_WEB_URL}/api/pay/callback/stripe?locale=${locale}&session_id={CHECKOUT_SESSION_ID}&order_no=${order.order_no}`,
    cancel_url: cancel_url,
  };

  if (order.user_email) {
    options.customer_email = order.user_email;
  }

  if (order.interval === "month" || order.interval === "year") {
    options.subscription_data = {
      metadata: options.metadata,
    };
  }

  if (order.currency === "cny") {
    options.payment_method_types = ["wechat_pay", "alipay", "card"];
    options.payment_method_options = {
      wechat_pay: {
        client: "web",
      },
      alipay: {},
    };
  }

  const session = await client.stripe().checkout.sessions.create(options);

  // update order detail
  await updateOrderSession(order.order_no, session.id, JSON.stringify(options), "stripe");

  return {
    order_no: order.order_no,
    session_id: session.id,
    checkout_url: session.url,
  };
}

async function creemCheckout({
  order,
  locale,
}: {
  order: Order;
  locale: string;
  cancel_url: string;
}) {
  const client = newCreemClient();

  let products: Record<string, string> = {};
  const productsEnv = process.env.CREEM_PRODUCTS;
  if (productsEnv) {
    products = typeof productsEnv === "string" ? JSON.parse(productsEnv) : productsEnv;
  }
  console.log("creem products: ", products);

  const product_id = products[order.product_id || ""] || "";
  if (!product_id) {
    throw new Error("invalid product_id");
  }

  const success_url = `${process.env.NEXT_PUBLIC_WEB_URL}/api/pay/callback/creem?locale=${locale}`;

  const result = await client.creem().createCheckout({
    xApiKey: client.apiKey(),
    createCheckoutRequest: {
      productId: product_id,
      requestId: order.order_no,
      customer: {
        email: order.user_email,
      },
      successUrl: success_url,
      metadata: {
        project: process.env.NEXT_PUBLIC_PROJECT_NAME || "",
        product_name: order.product_name || "",
        order_no: order.order_no,
        user_email: order.user_email,
        credits: order.credits,
        user_uuid: order.user_uuid,
      },
    },
  });

  // update order detail
  await updateOrderSession(order.order_no, result.id, JSON.stringify(result), "creem");

  return {
    order_no: order.order_no,
    session_id: result.id,
    checkout_url: result.checkoutUrl,
  };
}

async function paypalCheckout({
  order,
}: {
  order: Order;
  locale: string;
  cancel_url: string;
}) {
  const client = newPayPalClient();

  // For PayPal, we need to check if we have a PayPal plan mapping
  let paypalPlans: Record<string, string> = {};
  const plansEnv = process.env.PAYPAL_PLANS;
  if (plansEnv) {
    paypalPlans = typeof plansEnv === "string" ? JSON.parse(plansEnv) : plansEnv;
  }

  const paypal_plan_id = paypalPlans[order.product_id || ""] || "";
  if (!paypal_plan_id) {
    throw new Error("invalid paypal plan mapping for product_id");
  }

  // For subscription orders, create PayPal subscription
  const intervals = ["month", "year"];
  const is_subscription = intervals.includes(order.interval);

  if (is_subscription) {
    // Create subscription for recurring payments
    const subscription = await client.createSubscription(
      paypal_plan_id,
      order.user_uuid
    );

    // Update order with PayPal subscription details
    await updateOrderSession(
      order.order_no,
      subscription.id,
      JSON.stringify(subscription),
      "paypal"
    );

    // Find the approval link
    const approvalLink = subscription.links?.find(
      (link: {rel: string; href?: string}) => link.rel === "approve"
    );

    return {
      order_no: order.order_no,
      session_id: subscription.id,
      checkout_url: approvalLink?.href || "",
      subscription_id: subscription.id,
    };
  } else {
    // For one-time payments, we would need to create a different flow
    // PayPal subscriptions are mainly for recurring payments
    // For one-time payments, you might want to use PayPal Payments API instead
    throw new Error("PayPal one-time payments not implemented. Use PayPal subscriptions for recurring payments.");
  }
}
