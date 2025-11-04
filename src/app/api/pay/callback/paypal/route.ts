import { redirect } from "@/i18n/navigation";
import { newPayPalClient } from "@/integrations/paypal";
import { handlePayPalSubscription } from "@/services/paypal";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subscription_id = searchParams.get("subscription_id");
  const token = searchParams.get("token");
  const ba_token = searchParams.get("ba_token");

  const locale = searchParams.get("locale") || "en";
  let redirectUrl = "";

  try {
    // PayPal returns either subscription_id or token/ba_token
    const subscriptionId = subscription_id || token || ba_token;
    
    if (!subscriptionId) {
      throw new Error("invalid params: missing subscription ID");
    }

    const client = newPayPalClient();

    // Get subscription details from PayPal
    const subscription = await client.getSubscription(subscriptionId);

    console.log("paypal callback subscription: ", subscription);

    // Handle subscription activation (this will update order status)
    await handlePayPalSubscription(subscription);

    redirectUrl = process.env.NEXT_PUBLIC_PAY_SUCCESS_URL || "/";
  } catch (e) {
    console.log("handle paypal callback failed: ", e);
    redirectUrl = process.env.NEXT_PUBLIC_PAY_FAIL_URL || "/";
  }

  redirect({
    href: redirectUrl,
    locale: locale,
  });
}

