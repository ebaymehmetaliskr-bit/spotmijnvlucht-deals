// Email automation system for SpotMijnVlucht
export interface EmailSubscriber {
  id: string
  email: string
  firstName?: string
  lastName?: string
  subscriptionDate: Date
  preferences: {
    newsletter: boolean
    priceAlerts: boolean
    weeklyDigest: boolean
    promotions: boolean
  }
  priceAlerts: PriceAlert[]
  lastEmailSent?: Date
  emailStatus: "active" | "unsubscribed" | "bounced"
}

export interface PriceAlert {
  id: string
  destination: string
  maxPrice: number
  createdAt: Date
  isActive: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  type: "welcome" | "newsletter" | "price-alert" | "abandoned-booking" | "weekly-digest"
}

export class EmailAutomationService {
  private apiKey: string
  private fromEmail = "deals@spotmijnvlucht.nl"
  private fromName = "SpotMijnVlucht"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Welcome email series (3 emails over 7 days)
  async sendWelcomeSeries(subscriber: EmailSubscriber) {
    const welcomeEmails = [
      {
        delay: 0, // Immediate
        template: "welcome-1",
        subject: "🎉 Welkom bij SpotMijnVlucht! Je eerste deal wacht op je",
      },
      {
        delay: 2 * 24 * 60 * 60 * 1000, // 2 days
        template: "welcome-2",
        subject: "✈️ Zo vind je de beste vliegdeals - Tips van onze experts",
      },
      {
        delay: 7 * 24 * 60 * 60 * 1000, // 7 days
        template: "welcome-3",
        subject: "💰 Exclusieve deal alleen voor nieuwe leden - 50% korting!",
      },
    ]

    for (const email of welcomeEmails) {
      setTimeout(async () => {
        await this.sendEmail({
          to: subscriber.email,
          subject: email.subject,
          template: email.template,
          personalizations: {
            firstName: subscriber.firstName || "Reiziger",
            email: subscriber.email,
          },
        })
      }, email.delay)
    }
  }

  // Weekly deal digest
  async sendWeeklyDigest(subscribers: EmailSubscriber[], deals: any[]) {
    const topDeals = deals.slice(0, 5) // Top 5 deals
    const subject = `🔥 Deze week: ${topDeals.length} nieuwe topdeals vanaf €${Math.min(...topDeals.map((d) => d.currentPrice))}`

    for (const subscriber of subscribers) {
      if (subscriber.preferences.weeklyDigest && subscriber.emailStatus === "active") {
        await this.sendEmail({
          to: subscriber.email,
          subject,
          template: "weekly-digest",
          personalizations: {
            firstName: subscriber.firstName || "Reiziger",
            deals: topDeals,
            unsubscribeUrl: `https://spotmijnvlucht.nl/unsubscribe?token=${subscriber.id}`,
          },
        })
      }
    }
  }

  // Price drop alerts
  async sendPriceAlert(subscriber: EmailSubscriber, alert: PriceAlert, newPrice: number, deal: any) {
    const savings = alert.maxPrice - newPrice
    const subject = `🚨 Prijsalert: ${deal.destination} nu €${newPrice} (€${savings} goedkoper!)`

    await this.sendEmail({
      to: subscriber.email,
      subject,
      template: "price-alert",
      personalizations: {
        firstName: subscriber.firstName || "Reiziger",
        destination: deal.destination,
        oldPrice: alert.maxPrice,
        newPrice: newPrice,
        savings: savings,
        deal: deal,
        bookingUrl: `https://spotmijnvlucht.nl/deal/${deal.id}?utm_source=price_alert&utm_medium=email`,
      },
    })
  }

  // Abandoned booking recovery
  async sendAbandonedBookingEmail(userEmail: string, deal: any, abandonedAt: Date) {
    const hoursAbandoned = Math.floor((Date.now() - abandonedAt.getTime()) / (1000 * 60 * 60))

    let template = "abandoned-booking-1"
    let subject = `⏰ Je deal naar ${deal.destination} wacht nog op je!`

    if (hoursAbandoned >= 24) {
      template = "abandoned-booking-2"
      subject = `🔥 Laatste kans: ${deal.destination} voor €${deal.currentPrice} - nog ${deal.seatsRemaining} plaatsen!`
    }

    await this.sendEmail({
      to: userEmail,
      subject,
      template,
      personalizations: {
        destination: deal.destination,
        price: deal.currentPrice,
        originalPrice: deal.originalPrice,
        discount: deal.discount,
        seatsRemaining: deal.seatsRemaining,
        hoursAbandoned,
        bookingUrl: `https://spotmijnvlucht.nl/deal/${deal.id}?utm_source=abandoned_booking&utm_medium=email`,
        incentive: hoursAbandoned >= 24 ? "Extra 5% korting met code COMEBACK5" : null,
      },
    })
  }

  private async sendEmail(params: {
    to: string
    subject: string
    template: string
    personalizations: any
  }) {
    try {
      // In a real implementation, you'd integrate with SendGrid, Mailgun, etc.
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: { email: this.fromEmail, name: this.fromName },
          to: [{ email: params.to }],
          subject: params.subject,
          template_id: params.template,
          personalizations: params.personalizations,
        }),
      })

      if (!response.ok) {
        throw new Error(`Email send failed: ${response.statusText}`)
      }

      console.log(`Email sent successfully to ${params.to}`)
      return await response.json()
    } catch (error) {
      console.error("Failed to send email:", error)
      throw error
    }
  }
}

// Email template generator
export function generateEmailTemplate(type: string, data: any): string {
  const templates = {
    "welcome-1": `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welkom bij SpotMijnVlucht! ✈️</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Je reis naar betaalbare vliegdeals begint hier</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hoi ${data.firstName},</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Welkom bij SpotMijnVlucht! We zijn blij dat je je hebt aangemeld voor onze exclusieve vliegdeals. 
            Vanaf nu ontvang je de beste aanbiedingen rechtstreeks in je inbox.
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">🎁 Welkomstcadeau</h3>
            <p style="margin: 0; color: #374151;">Gebruik code <strong>WELKOM10</strong> voor 10% extra korting op je eerste boeking!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://spotmijnvlucht.nl/deals" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Bekijk Huidige Deals
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Heb je vragen? Stuur ons een email op <a href="mailto:support@spotmijnvlucht.nl">support@spotmijnvlucht.nl</a>
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>SpotMijnVlucht.nl - De beste vliegdeals van Nederland</p>
        </div>
      </div>
    `,

    "price-alert": `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Prijsalert!</h1>
          <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">De prijs is gedaald voor ${data.destination}</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hoi ${data.firstName},</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Goed nieuws! De prijs voor je gewenste bestemming <strong>${data.destination}</strong> is gedaald!
          </p>
          
          <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
            <h2 style="color: #15803d; margin: 0 0 15px 0; font-size: 24px;">${data.destination}</h2>
            <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0;">
              <div>
                <span style="text-decoration: line-through; color: #6b7280; font-size: 18px;">€${data.oldPrice}</span>
              </div>
              <div>
                <span style="font-size: 32px; font-weight: bold; color: #15803d;">€${data.newPrice}</span>
              </div>
            </div>
            <p style="color: #15803d; font-size: 18px; font-weight: bold; margin: 0;">
              Je bespaart €${data.savings}! 🎉
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.bookingUrl}" style="background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              Boek Nu Deze Deal
            </a>
          </div>
          
          <p style="font-size: 14px; color: #ef4444; text-align: center; margin: 20px 0;">
            ⚡ Beperkte tijd beschikbaar - boek snel!
          </p>
        </div>
      </div>
    `,

    "weekly-digest": `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔥 Wekelijkse Deal Digest</h1>
          <p style="color: #ddd6fe; margin: 10px 0 0 0; font-size: 16px;">De beste deals van deze week</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">Hoi ${data.firstName},</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 30px;">
            Hier zijn de beste vliegdeals van deze week. Mis deze kansen niet!
          </p>
          
          ${data.deals
            .map(
              (deal: any) => `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0; background: #fafafa;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="color: #1f2937; margin: 0 0 5px 0; font-size: 20px;">${deal.destination}</h3>
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">via ${deal.airline}</p>
                </div>
                <div style="text-align: right;">
                  <div style="color: #ef4444; font-size: 12px; font-weight: bold;">-${deal.discount}%</div>
                  <div style="font-size: 24px; font-weight: bold; color: #059669;">€${deal.currentPrice}</div>
                  <div style="text-decoration: line-through; color: #6b7280; font-size: 14px;">€${deal.originalPrice}</div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://spotmijnvlucht.nl/deals" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Bekijk Alle Deals
            </a>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Uitschrijven</a> | SpotMijnVlucht.nl</p>
        </div>
      </div>
    `,
  }

  return templates[type as keyof typeof templates] || ""
}
