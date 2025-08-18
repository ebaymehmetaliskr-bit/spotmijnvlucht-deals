import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailRecipient {
  email: string
  name?: string
  preferences?: any
}

// Email templates
export const emailTemplates = {
  welcome: (name: string): EmailTemplate => ({
    subject: "Welkom bij SpotMijnVlucht! 🛫",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welkom bij SpotMijnVlucht!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Ontdek de beste vliegdeals</p>
        </div>
        <div style="padding: 40px 20px;">
          <h2 style="color: #1e40af; margin-bottom: 20px;">Hallo ${name || "reiziger"}!</h2>
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Bedankt voor je aanmelding! Je ontvangt nu exclusieve vliegdeals met gemiddeld €300 besparing.
          </p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Wat kun je verwachten?</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Wekelijkse deals naar topbestemmingen</li>
              <li>Prijsdalingen voor jouw favoriete bestemmingen</li>
              <li>Exclusieve last-minute aanbiedingen</li>
              <li>Persoonlijke reisaanbevelingen</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" 
               style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Bekijk Huidige Deals
            </a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>SpotMijnVlucht.nl - De beste vliegdeals, dagelijks bijgewerkt</p>
        </div>
      </div>
    `,
    text: `Welkom bij SpotMijnVlucht! Bedankt voor je aanmelding. Je ontvangt nu exclusieve vliegdeals met gemiddeld €300 besparing.`,
  }),

  weeklyDeals: (deals: any[]): EmailTemplate => ({
    subject: "Deze week: Vliegdeals vanaf €45! ✈️",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Wekelijkse Vliegdeals</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Handgeselecteerde topdeals</p>
        </div>
        <div style="padding: 20px;">
          ${deals
            .map(
              (deal) => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0; overflow: hidden;">
              <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h3 style="color: #1e40af; margin: 0; font-size: 20px;">${deal.destination}</h3>
                  <span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    -${deal.discount_percentage}%
                  </span>
                </div>
                <p style="color: #6b7280; margin: 5px 0;">${deal.airline}</p>
                <div style="margin: 15px 0;">
                  <span style="color: #9ca3af; text-decoration: line-through; margin-right: 10px;">€${deal.original_price}</span>
                  <span style="color: #dc2626; font-size: 24px; font-weight: bold;">€${deal.current_price}</span>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                  <a href="${deal.affiliate_url}" 
                     style="background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Bekijk Deal
                  </a>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>SpotMijnVlucht.nl - De beste vliegdeals, dagelijks bijgewerkt</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #6b7280;">Uitschrijven</a>
        </div>
      </div>
    `,
    text: `Wekelijkse vliegdeals van SpotMijnVlucht! Bekijk de beste deals van deze week.`,
  }),

  priceAlert: (destination: string, price: number, originalPrice: number): EmailTemplate => ({
    subject: `🚨 Prijsdaling! ${destination} nu vanaf €${price}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Prijsalert!</h1>
          <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">De prijs is gedaald!</p>
        </div>
        <div style="padding: 40px 20px; text-align: center;">
          <h2 style="color: #1e40af; margin-bottom: 20px;">${destination}</h2>
          <div style="background: #f3f4f6; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 15px;">
              <span style="color: #9ca3af; text-decoration: line-through; font-size: 18px;">€${originalPrice}</span>
            </div>
            <div style="color: #dc2626; font-size: 36px; font-weight: bold; margin-bottom: 10px;">€${price}</div>
            <p style="color: #374151; margin: 0;">Bespaar €${originalPrice - price}!</p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/deals" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Boek Nu!
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            ⏰ Deze deal kan snel uitverkocht zijn. Boek vandaag nog!
          </p>
        </div>
      </div>
    `,
    text: `Prijsalert! ${destination} nu vanaf €${price} (was €${originalPrice}). Bespaar €${originalPrice - price}!`,
  }),

  abandonedBooking: (destination: string, price: number): EmailTemplate => ({
    subject: `Vergeten te boeken? ${destination} wacht nog op je! 🛫`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Je reis wacht nog!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Maak je boeking af</p>
        </div>
        <div style="padding: 40px 20px; text-align: center;">
          <h2 style="color: #1e40af; margin-bottom: 20px;">Hallo reiziger!</h2>
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Je was bezig met het boeken van een reis naar <strong>${destination}</strong> voor slechts <strong>€${price}</strong>.
          </p>
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-weight: bold;">
              ⚠️ Let op: Deze deal kan snel uitverkocht zijn!
            </p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/deals" 
               style="background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Maak Boeking Af
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Nog vragen? Neem contact met ons op via info@spotmijnvlucht.nl
          </p>
        </div>
      </div>
    `,
    text: `Je was bezig met het boeken van ${destination} voor €${price}. Maak je boeking snel af voordat de deal uitverkocht is!`,
  }),
}

// Email sending functions
export async function sendWelcomeEmail(recipient: EmailRecipient) {
  const template = emailTemplates.welcome(recipient.name || "")

  try {
    const { data, error } = await resend.emails.send({
      from: "SpotMijnVlucht <deals@spotmijnvlucht.nl>",
      to: [recipient.email],
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error("Error sending welcome email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export async function sendWeeklyDealsEmail(recipients: EmailRecipient[], deals: any[]) {
  const template = emailTemplates.weeklyDeals(deals)

  try {
    const emailPromises = recipients.map((recipient) =>
      resend.emails.send({
        from: "SpotMijnVlucht <deals@spotmijnvlucht.nl>",
        to: [recipient.email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    )

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter((result) => result.status === "fulfilled").length
    const failed = results.filter((result) => result.status === "rejected").length

    return { success: true, sent: successful, failed }
  } catch (error) {
    console.error("Error sending weekly deals emails:", error)
    return { success: false, error }
  }
}

export async function sendPriceAlert(
  recipient: EmailRecipient,
  destination: string,
  price: number,
  originalPrice: number,
) {
  const template = emailTemplates.priceAlert(destination, price, originalPrice)

  try {
    const { data, error } = await resend.emails.send({
      from: "SpotMijnVlucht <alerts@spotmijnvlucht.nl>",
      to: [recipient.email],
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error("Error sending price alert:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending price alert:", error)
    return { success: false, error }
  }
}

export async function sendAbandonedBookingEmail(recipient: EmailRecipient, destination: string, price: number) {
  const template = emailTemplates.abandonedBooking(destination, price)

  try {
    const { data, error } = await resend.emails.send({
      from: "SpotMijnVlucht <support@spotmijnvlucht.nl>",
      to: [recipient.email],
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error("Error sending abandoned booking email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending abandoned booking email:", error)
    return { success: false, error }
  }
}

export async function sendBroadcastEmail(email: string, subject: string, content: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "SpotMijnVlucht <deals@spotmijnvlucht.nl>",
      to: [email],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SpotMijnVlucht</h1>
          </div>
          <div style="padding: 40px 20px;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">Hallo ${name || "reiziger"}!</h2>
            <div style="color: #374151; line-height: 1.6;">
              ${content.replace(/\n/g, "<br>")}
            </div>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>SpotMijnVlucht.nl - De beste vliegdeals, dagelijks bijgewerkt</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #6b7280;">Uitschrijven</a>
          </div>
        </div>
      `,
      text: content,
    })

    if (error) {
      console.error("Error sending broadcast email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending broadcast email:", error)
    return { success: false, error }
  }
}
