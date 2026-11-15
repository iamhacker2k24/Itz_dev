import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Please provide name, email, and message." },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL
    const senderEmail = process.env.BREVO_SENDER_EMAIL
    const senderName = process.env.BREVO_SENDER_NAME

    // If API key is not yet configured, log and return informative success response
    if (!brevoApiKey || brevoApiKey === "your_brevo_api_key_here") {
      console.warn("BREVO_API_KEY is not yet configured. Contact form received message:", {
        name,
        email,
        message,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Message received! (Brevo API key pending configuration)",
        },
        { status: 200 }
      );
    }

    // 1. Send Notification Email to You via Brevo v3 Transactional API
    const sendNotification = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: recipientEmail,
            name: "Debabrata Paul",
          },
        ],
        replyTo: {
          email: email,
          name: name,
        },
        subject: `New Portfolio Message from ${name}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 10px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" style="max-width: 580px; background: #1e293b; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                      <!-- Header Banner -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #db2777 100%); padding: 35px 30px; text-align: center;">
                          <div style="display: inline-block; background: rgba(255,255,255,0.2); border-radius: 12px; padding: 6px 14px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; margin-bottom: 12px;">
                            Portfolio Notification
                          </div>
                          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                            New Message Received! 🚀
                          </h1>
                        </td>
                      </tr>

                      <!-- Body Content -->
                      <tr>
                        <td style="padding: 30px;">
                          <!-- Sender Card -->
                          <table role="presentation" width="100%" style="background: #0f172a; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px; padding: 18px 20px;">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">From</span>
                                <div style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-top: 2px;">${name}</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Email Address</span>
                                <div style="font-size: 15px; margin-top: 2px;">
                                  <a href="mailto:${email}" style="color: #fb923c; text-decoration: none; font-weight: 600;">${email}</a>
                                </div>
                              </td>
                            </tr>
                          </table>

                          <!-- Message Card -->
                          <div style="margin-bottom: 8px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">User Message</span>
                          </div>
                          <div style="background: linear-gradient(180deg, #0f172a 0%, #172033 100%); border-left: 4px solid #f97316; padding: 20px; border-radius: 0 14px 14px 0; color: #e2e8f0; font-size: 14px; line-height: 1.7; border-top: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
                            ${message.replace(/\n/g, "<br/>")}
                          </div>

                          <!-- Reply Button -->
                          <div style="text-align: center; margin-top: 30px;">
                            <a href="mailto:${email}?subject=Re:%20Debabrata%20Paul%20Portfolio" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 13px 32px; border-radius: 12px; box-shadow: 0 6px 20px rgba(249,115,22,0.4);">
                              Reply to ${name} &rarr;
                            </a>
                          </div>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 20px; background: #0b1120; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b;">
                          Sent via <strong style="color: #94a3b8;">Debabrata Paul Portfolio</strong> &bull; Contact Form System
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    if (!sendNotification.ok) {
      const errorData = await sendNotification.json().catch(() => ({}));
      console.error("Brevo API notification error:", errorData);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to send email via Brevo.",
        },
        { status: 500 }
      );
    }

    // 2. Optional Auto-Reply to the Sender
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: email,
              name: name,
            },
          ],
          subject: "Thank you for reaching out — Debabrata Paul",
          htmlContent: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 35px 10px;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="100%" style="max-width: 580px; background: #131b2e; border-radius: 24px; overflow: hidden; border: 1px solid rgba(249, 115, 22, 0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);">
                        
                        <!-- Header Banner with Gradient -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #f97316 0%, #fb923c 40%, #ec4899 100%); padding: 45px 35px; text-align: center;">
                            <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.25); border-radius: 16px; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; font-size: 26px; line-height: 56px;">
                              ✨
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                              Thank You, ${name}!
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 500;">
                              Your message is safely in my inbox
                            </p>
                          </td>
                        </tr>

                        <!-- Body Card -->
                        <tr>
                          <td style="padding: 35px 32px 30px 32px; color: #cbd5e1;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #f1f5f9;">
                              Hi <strong style="color: #fb923c;">${name}</strong>,
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                              Thank you for visiting my portfolio and taking the time to write to me! I have received your message and will review it and reply as soon as possible.
                            </p>

                            <!-- Highlight Info Box -->
                            <div style="background: linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(236,72,153,0.06) 100%); border-left: 4px solid #f97316; border-radius: 0 14px 14px 0; padding: 18px 22px; margin: 25px 0;">
                              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #f97316; margin-bottom: 4px;">
                                Typical Response Time
                              </div>
                              <div style="font-size: 14px; color: #e2e8f0; font-weight: 500;">
                                ⚡ Within <strong>24 hours</strong> (usually much faster)
                              </div>
                            </div>

                            <p style="margin: 25px 0 0 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                              In the meantime, feel free to check out my latest creations or connect directly:
                            </p>

                            <!-- Social Action Links -->
                            <div style="margin-top: 22px; text-align: center;">
                              <a href="https://www.linkedin.com/in/debabrata2024" target="_blank" style="display: inline-block; background: #0a66c2; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 10px; margin: 4px 6px;">
                                Connect on LinkedIn
                              </a>
                              <a href="mailto:help.devapps@gmail.com" style="display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #f8fafc; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 10px; margin: 4px 6px;">
                                Direct Email
                              </a>
                            </div>

                            <!-- Signature -->
                            <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.08);">
                              <div style="font-size: 15px; font-weight: 700; color: #f8fafc;">
                                Debabrata Paul
                              </div>
                              <div style="font-size: 13px; color: #f97316; font-weight: 600; margin-top: 2px;">
                                Software Engineer &bull; Full-Stack & IoT
                              </div>
                            </div>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="padding: 22px; background: #0b0f19; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b;">
                            &copy; ${new Date().getFullYear()} <strong style="color: #94a3b8;">Debabrata Paul</strong>. All rights reserved.
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        }),
      });
    } catch (autoReplyError) {
      console.error("Auto-reply error (non-fatal):", autoReplyError);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact API route error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

