import { env } from '@/env';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const hostname = env.NEXT_PUBLIC_HOSTNAME;

  const resetLink = `${hostname}/new-password?token=${token}`;
  await resend.emails.send({
    from: `Noteworthy <onboarding@${env.RESEND_DOMAIN}>`,
    to: [email],
    subject: 'Reset password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
