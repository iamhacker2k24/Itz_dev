import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "help.devapps@gmail.com";
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "mr.debabrtapc2006@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME || "Debabrata Paul Portfolio";

    const downloadTime = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    if (brevoApiKey && brevoApiKey !== "your_brevo_api_key_here") {
      // 1. Prepare PDF attachment in base64
      let attachment = [];
      try {
        const pdfPath = path.join(process.cwd(), "public", "Debabrata Paul.pdf");
        if (fs.existsSync(pdfPath)) {
          const pdfBuffer = fs.readFileSync(pdfPath);
          attachment.push({
            name: "Debabrata_Paul_CV.pdf",
            content: pdfBuffer.toString("base64"),
          });
        }
      } catch (attachErr) {
        console.error("Could not load PDF attachment:", attachErr);
      }

      // 2. Send notification to YOU that someone downloaded your CV
      fetch("https://api.brevo.com/v3/smtp/email", {
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
          },
          subject: `📄 Someone downloaded your CV! (${email})`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 35px 10px;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="100%" style="max-width: 580px; background: #1e293b; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                        
                        <!-- Header Banner -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #8b5cf6 100%); padding: 35px 30px; text-align: center;">
                            <div style="display: inline-block; background: rgba(255,255,255,0.2); border-radius: 12px; padding: 6px 14px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; margin-bottom: 12px;">
                              Resume Alert
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                              New CV Download! 📥
                            </h1>
                          </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                          <td style="padding: 30px;">
                            <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 20px 0; line-height: 1.6;">
                              Someone entered their email and downloaded your Curriculum Vitae from your portfolio:
                            </p>

                            <!-- User Info Box -->
                            <table role="presentation" width="100%" style="background: #0f172a; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); padding: 18px 20px; margin-bottom: 24px;">
                              <tr>
                                <td style="padding-bottom: 10px;">
                                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Visitor Email</span>
                                  <div style="font-size: 17px; font-weight: 700; margin-top: 4px;">
                                    <a href="mailto:${email}" style="color: #fb923c; text-decoration: none;">${email}</a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Downloaded At</span>
                                  <div style="font-size: 14px; color: #e2e8f0; margin-top: 4px;">
                                    ${downloadTime}
                                  </div>
                                </td>
                              </tr>
                            </table>

                            <!-- Action Button -->
                            <div style="text-align: center; margin-top: 25px;">
                              <a href="mailto:${email}?subject=Thank%20you%20for%20downloading%20my%20CV%20-%20Debabrata%20Paul" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 13px 30px; border-radius: 12px; box-shadow: 0 6px 20px rgba(249,115,22,0.4);">
                                Send Email to Visitor &rarr;
                              </a>
                            </div>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="padding: 20px; background: #0b1120; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b;">
                            Sent from <strong style="color: #94a3b8;">Debabrata Paul Portfolio</strong> &bull; CV Tracking System
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
      }).catch((e) => console.error("Admin notification error:", e));

      // 3. Send CV copy with attachment to the VISITOR'S email
      fetch("https://api.brevo.com/v3/smtp/email", {
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
            },
          ],
          replyTo: {
            email: recipientEmail,
            name: "Debabrata Paul",
          },
          subject: "Here is your copy of Debabrata Paul's CV 📄",
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
                            <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.25); border-radius: 16px; margin: 0 auto 16px auto; font-size: 26px; line-height: 56px;">
                              📄
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                              Here is Your Copy of My CV
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 500;">
                              Debabrata Paul &bull; Software Engineer
                            </p>
                          </td>
                        </tr>

                        <!-- Body Card -->
                        <tr>
                          <td style="padding: 35px 32px 30px 32px; color: #cbd5e1;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #f1f5f9;">
                              Hello!
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                              Thank you for your interest in my background, projects, and technical skills. As requested on my portfolio, I have attached a fresh copy of my <strong>Curriculum Vitae (PDF)</strong> directly to this email so you always have it saved.
                            </p>

                            <!-- Attachment Highlight Box -->
                            <div style="background: linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(236,72,153,0.06) 100%); border-left: 4px solid #f97316; border-radius: 0 14px 14px 0; padding: 18px 22px; margin: 25px 0;">
                              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #f97316; margin-bottom: 4px;">
                                Included Attachment
                              </div>
                              <div style="font-size: 15px; color: #e2e8f0; font-weight: 600;">
                                📎 Debabrata_Paul_CV.pdf
                              </div>
                              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
                                (Attached to this email for quick viewing and forwarding)
                              </div>
                            </div>

                            <p style="margin: 25px 0 0 0; font-size: 15px; line-height: 1.7; color: #94a3b8;">
                              I am always open to exciting software engineering roles, collaboration opportunities, and innovative projects. Feel free to connect:
                            </p>

                            <!-- Social Action Links -->
                            <div style="margin-top: 22px; text-align: center;">
                              <a href="https://www.linkedin.com/in/debabrata2024" target="_blank" style="display: inline-block; background: #0a66c2; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 10px; margin: 4px 6px;">
                                Connect on LinkedIn
                              </a>
                              <a href="mailto:help.devapps@gmail.com" style="display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #f8fafc; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 10px; margin: 4px 6px;">
                                Reply Directly
                              </a>
                            </div>

                            <!-- Signature -->
                            <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.08);">
                              <div style="font-size: 15px; font-weight: 700; color: #f8fafc;">
                                Debabrata Paul
                              </div>
                              <div style="font-size: 13px; color: #f97316; font-weight: 600; margin-top: 2px;">
                                Software Engineer &bull; Full-Stack, IoT & AI
                              </div>
                              <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
                                <a href="mailto:help.devapps@gmail.com" style="color: #94a3b8; text-decoration: none;">help.devapps@gmail.com</a>
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
          ...(attachment.length > 0 ? { attachment } : {}),
        }),
      }).catch((e) => console.error("Visitor CV backup email error:", e));
    }

    return NextResponse.json({
      success: true,
      message: "CV downloaded and sent to your email!",
    });
  } catch (error) {
    console.error("CV download notification error:", error);
    return NextResponse.json({
      success: true,
      message: "CV downloaded successfully!",
    });
  }
}
