import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const hostname = process.env.NEXT_PUBLIC_HOSTNAME;

  const resetLink = `${hostname}/new-password?token=${token}`;
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [email],
    subject: 'Reset password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
