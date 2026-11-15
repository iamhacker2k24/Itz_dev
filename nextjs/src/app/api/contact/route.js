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
    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "help.devapps@gmail.com";
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "help.devapps@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME || "Debabrata Paul Portfolio";

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
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #f97316; margin-bottom: 20px;">New Contact Form Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316; margin: 15px 0;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
          </div>
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
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
              <h2 style="color: #f97316;">Hi ${name},</h2>
              <p>Thank you for getting in touch with me through my portfolio website!</p>
              <p>I have received your message and will review it and reply as soon as possible.</p>
              <br/>
              <p>Best regards,<br/><strong>Debabrata Paul</strong><br/>Software Engineer</p>
            </div>
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

