export function userEmailHtml({ name, message }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border: 1px solid #eee; border-radius: 12px; padding: 24px; background: #ffffff;">
          <h2 style="color: #f97316; margin: 0 0 12px 0;">Hi ${name}, thanks for reaching out!</h2>
          <p style="font-size: 15px; color: #444;">
            I received your message and will get back to you as soon as possible.
          </p>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
            <p style="margin: 0; font-size: 14px; color: #555;"><strong>Your Message:</strong></p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #333; font-style: italic; white-space: pre-wrap;">"${message}"</p>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 25px;">
            Best regards,<br />
            <strong>Debabrata Paul</strong><br />
            Software Engineer
          </p>
        </div>
      </body>
    </html>
  `;
}
