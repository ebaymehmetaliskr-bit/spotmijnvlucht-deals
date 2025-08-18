export class AnalyticsTracker {
  private static instance: AnalyticsTracker
  private sessionId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker()
    }
    return AnalyticsTracker.instance
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  public async trackEvent(eventType: string, eventData?: Record<string, any>, dealId?: string) {
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType,
          dealId,
          sessionId: this.sessionId,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          eventData: {
            ...eventData,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          },
        }),
      })
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  public trackPageView() {
    this.trackEvent("page_view", {
      page: window.location.pathname,
      title: document.title,
    })
  }

  public trackDealClick(dealId: string, destination: string) {
    this.trackEvent(
      "deal_click",
      {
        destination,
        position: "deal_card",
      },
      dealId,
    )
  }

  public trackAffiliateClick(dealId: string, affiliateUrl: string) {
    this.trackEvent(
      "affiliate_click",
      {
        affiliateUrl,
      },
      dealId,
    )
  }

  public trackEmailSignup(email: string, source: string) {
    this.trackEvent("email_signup", {
      email,
      source,
    })
  }

  public trackConversion(dealId: string, value: number) {
    this.trackEvent(
      "conversion",
      {
        value,
        currency: "EUR",
      },
      dealId,
    )
  }
}

export const analytics = AnalyticsTracker.getInstance()
