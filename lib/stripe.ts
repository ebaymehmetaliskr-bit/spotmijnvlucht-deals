import Stripe from "stripe"

// Lazy initialization of Stripe client
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set")
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
      typescript: true,
    })
  }

  return stripeInstance
}

// For backward compatibility, export stripe but with lazy initialization
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export const STRIPE_PRICE_IDS = {
  get premium_monthly() {
    const priceId = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID
    if (!priceId) {
      throw new Error("STRIPE_PREMIUM_MONTHLY_PRICE_ID environment variable is not set")
    }
    return priceId
  },
  get premium_yearly() {
    const priceId = process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
    if (!priceId) {
      throw new Error("STRIPE_PREMIUM_YEARLY_PRICE_ID environment variable is not set")
    }
    return priceId
  },
}

export const SUBSCRIPTION_PLANS = {
  premium_monthly: {
    name: "Premium Maandelijks",
    price: 9.99,
    interval: "month",
    features: [
      "Exclusieve premium deals",
      "Advertentievrije ervaring",
      "Prioriteit klantenservice",
      "Geavanceerde prijsalarmen",
      "Vroege toegang tot deals",
    ],
  },
  premium_yearly: {
    name: "Premium Jaarlijks",
    price: 99.99,
    interval: "year",
    features: [
      "Exclusieve premium deals",
      "Advertentievrije ervaring",
      "Prioriteit klantenservice",
      "Geavanceerde prijsalarmen",
      "Vroege toegang tot deals",
      "2 maanden gratis!",
    ],
  },
}

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string,
) {
  try {
    const stripeClient = getStripe()
    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/premium`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
      metadata: {
        plan_type: priceId === STRIPE_PRICE_IDS.premium_yearly ? "yearly" : "monthly",
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const stripeClient = getStripe()
    const session = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating customer portal session:", error)
    throw error
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const stripeClient = getStripe()
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error("Error retrieving subscription:", error)
    return null
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const stripeClient = getStripe()
    const subscription = await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return subscription
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw error
  }
}
