import { NextRequest, NextResponse } from "next/server";
import { newPayPalClient } from "@/integrations/paypal";
import { handlePayPalWebhook } from "@/services/paypal";

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    // Get PayPal webhook headers
    const headers = {
      "paypal-auth-algo": request.headers.get("paypal-auth-algo") || undefined,
      "paypal-cert-url": request.headers.get("paypal-cert-url") || undefined,
      "paypal-transmission-id": request.headers.get("paypal-transmission-id") || undefined,
      "paypal-transmission-sig": request.headers.get("paypal-transmission-sig") || undefined,
      "paypal-transmission-time": request.headers.get("paypal-transmission-time") || undefined,
    };

    // Verify webhook signature in production
    if (process.env.NODE_ENV === "production") {
      const client = newPayPalClient();
      
      try {
        const isValid = await client.verifyWebhookSignature(rawBody, headers);
        if (!isValid) {
          console.error("PayPal webhook signature verification failed");
          return NextResponse.json(
            { error: "Invalid webhook signature" },
            { status: 401 }
          );
        }
      } catch (e) {
        console.error("PayPal webhook signature verification error:", e);
        return NextResponse.json(
          { error: "Webhook verification failed" },
          { status: 401 }
        );
      }
    } else {
      console.log("⚠️ Skipping PayPal webhook verification in development environment");
    }

    // Parse webhook event
    const event = JSON.parse(rawBody);
    
    console.log("Received PayPal webhook:", {
      event_type: event.event_type,
      event_id: event.id,
      transmission_id: headers["paypal-transmission-id"],
    });

    // Check for duplicate events using transmission ID
    const transmissionId = headers["paypal-transmission-id"];
    if (transmissionId) {
      // TODO: Implement duplicate check using database
      // For now, we'll just log it
      console.log("Processing PayPal webhook with transmission ID:", transmissionId);
    }

    // Process the webhook event
    await handlePayPalWebhook(event);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("PayPal webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

