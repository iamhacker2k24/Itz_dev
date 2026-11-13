import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminEmailHtml } from '@/sendmail/adminmail';
import { userEmailHtml } from '@/sendmail/usermail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required.' },
        { status: 400 }
      );
    }

    // 1. Send notification to the portfolio owner (Debabrata) using clean HTML (no JSX / @react-email / prettier required)
    const adminMail = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['help.devapps@gmail.com'],
      replyTo: email,
      subject: `New Message from ${name} - Portfolio`,
      html: adminEmailHtml({ name, email, message }),
    });

    if (adminMail.error) {
      console.error('Resend Admin Email Error:', adminMail.error);
      return NextResponse.json(
        { success: false, error: adminMail.error.message || 'Failed to send admin email' },
        { status: 500 }
      );
    }

    // 2. Automated confirmation to user (optional auto-reply)
    try {
      await resend.emails.send({
        from: 'Debabrata Paul <onboarding@resend.dev>',
        to: [email],
        subject: 'Thank you for contacting Debabrata Paul',
        html: userEmailHtml({ name, message }),
      });
    } catch (userMailErr) {
      console.warn('Auto-reply to user skipped by Resend sandbox:', userMailErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      id: adminMail.data?.id,
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
