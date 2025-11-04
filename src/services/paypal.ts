import { updateOrder, updateSubOrder } from "./order";
import { newPayPalClient } from "@/integrations/paypal";
import { findOrderBySessionId } from "@/models/order";

// Handle PayPal subscription - similar to Stripe subscription handling
export async function handlePayPalSubscription(subscription: any) {
  try {
    // Extract subscription information
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const customId = subscription.custom_id; // This should be user_uuid
    const planId = subscription.plan_id;

    console.log("Processing PayPal subscription:", {
      subscriptionId,
      status,
      customId,
      planId,
    });

    // Only handle active subscriptions
    if (status !== "ACTIVE") {
      console.log("Subscription not active, skipping:", status);
      return;
    }

    // Find the order using PayPal subscription ID as session_id
    const order = await findOrderBySessionId(subscriptionId);
    if (!order) {
      throw new Error(`Order not found for PayPal subscription: ${subscriptionId}`);
    }

    // Update order with PayPal payment details
    const paid_email = subscription.subscriber?.email_address || order.user_email;
    const paid_detail = JSON.stringify(subscription);

    await updateOrder({
      order_no: order.order_no,
      paid_email,
      paid_detail,
    });

    console.log("PayPal subscription processed successfully:", order.order_no);

  } catch (e) {
    console.log("handle PayPal subscription failed: ", e);
    throw e;
  }
}

// Handle PayPal webhook events
export async function handlePayPalWebhook(event: any) {
  try {
    const eventType = event.event_type;
    const resource = event.resource;

    console.log("Processing PayPal webhook event:", eventType);

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.CREATED":
        console.log("Subscription created:", resource.id);
        // Just log for now, wait for activation
        break;

      case "BILLING.SUBSCRIPTION.ACTIVATED":
        console.log("Subscription activated:", resource.id);
        await handleSubscriptionActivated(resource);
        break;

      case "BILLING.SUBSCRIPTION.CANCELLED":
        console.log("Subscription cancelled:", resource.id);
        await handleSubscriptionCancelled(resource);
        break;

      case "BILLING.SUBSCRIPTION.SUSPENDED":
        console.log("Subscription suspended:", resource.id);
        await handleSubscriptionSuspended(resource);
        break;

      case "BILLING.SUBSCRIPTION.EXPIRED":
        console.log("Subscription expired:", resource.id);
        await handleSubscriptionExpired(resource);
        break;

      case "BILLING.SUBSCRIPTION.PAYMENT_FAILED":
        console.log("Subscription payment failed:", resource.id);
        await handlePaymentFailed(resource);
        break;

      case "BILLING.SUBSCRIPTION.RENEWED":
        console.log("Subscription renewed:", resource.id);
        await handleSubscriptionRenewed(resource);
        break;

      case "PAYMENT.SALE.COMPLETED":
        console.log("Payment sale completed:", resource.id);
        await handlePaymentCompleted(resource);
        break;

      default:
        console.log("Unhandled PayPal webhook event:", eventType);
    }

  } catch (e) {
    console.log("handle PayPal webhook failed: ", e);
    throw e;
  }
}

async function handleSubscriptionActivated(subscription: any) {
  try {
    // Get order information from subscription
    const customId = subscription.custom_id; // user_uuid
    const subscriptionId = subscription.id;

    // You would need to implement order lookup by subscription ID
    // For now, this is a placeholder
    console.log("Subscription activated for user:", customId);

    // TODO: Update order status to paid
    // TODO: Add credits to user account
    // TODO: Update user subscription status

  } catch (e) {
    console.log("handle subscription activated failed: ", e);
    throw e;
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  try {
    const customId = subscription.custom_id;
    const subscriptionId = subscription.id;

    console.log("Subscription cancelled for user:", customId);

    // TODO: Update user subscription status to cancelled
    // TODO: Remove access to premium features

  } catch (e) {
    console.log("handle subscription cancelled failed: ", e);
    throw e;
  }
}

async function handleSubscriptionSuspended(subscription: any) {
  try {
    const customId = subscription.custom_id;
    const subscriptionId = subscription.id;

    console.log("Subscription suspended for user:", customId);

    // TODO: Temporarily suspend user access
    // TODO: Send notification to user

  } catch (e) {
    console.log("handle subscription suspended failed: ", e);
    throw e;
  }
}

async function handleSubscriptionExpired(subscription: any) {
  try {
    const customId = subscription.custom_id;
    const subscriptionId = subscription.id;

    console.log("Subscription expired for user:", customId);

    // TODO: Update user subscription status to expired
    // TODO: Remove access to premium features

  } catch (e) {
    console.log("handle subscription expired failed: ", e);
    throw e;
  }
}

async function handlePaymentFailed(subscription: any) {
  try {
    const customId = subscription.custom_id;
    const subscriptionId = subscription.id;

    console.log("Payment failed for user:", customId);

    // TODO: Log payment failure
    // TODO: Send notification to user
    // TODO: Update subscription status

  } catch (e) {
    console.log("handle payment failed failed: ", e);
    throw e;
  }
}

async function handleSubscriptionRenewed(subscription: any) {
  try {
    const customId = subscription.custom_id;
    const subscriptionId = subscription.id;

    console.log("Subscription renewed for user:", customId);

    // TODO: Add credits for renewed subscription
    // TODO: Update subscription period
    // TODO: Create renewal order record

  } catch (e) {
    console.log("handle subscription renewed failed: ", e);
    throw e;
  }
}

async function handlePaymentCompleted(payment: any) {
  try {
    console.log("Payment completed:", payment.id);

    // TODO: Record payment transaction
    // TODO: Update order status if needed

  } catch (e) {
    console.log("handle payment completed failed: ", e);
    throw e;
  }
}
