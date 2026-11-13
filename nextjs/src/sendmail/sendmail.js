import { Resend } from 'resend';
import { adminEmailHtml } from './adminmail';
import { userEmailHtml } from './usermail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail({ name, email, message }) {
  const adminResult = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: ['help.devapps@gmail.com'],
    replyTo: email,
    subject: `New Message from ${name} - Portfolio`,
    html: adminEmailHtml({ name, email, message }),
  });

  try {
    await resend.emails.send({
      from: 'Debabrata Paul <onboarding@resend.dev>',
      to: [email],
      subject: 'Thank you for reaching out - Debabrata Paul',
      html: userEmailHtml({ name, message }),
    });
  } catch (err) {
    console.warn('Auto-reply to visitor skipped:', err?.message);
  }

  return adminResult;
}
