import nodemailer from 'nodemailer';

export default async function sendVerificationEmail(email: string, url: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SERVICE_ACCOUNT_EMAIL,
      pass: process.env.SERVICE_ACCOUNT_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Limis Support" <${process.env.SERVICE_ACCOUNT_EMAIL}>`,
    to: email,
    subject: 'Verify Your Limis Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #2563eb;">Welcome to Limis!</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p>If the button above doesn’t work, you can also copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;"><a href="${url}">${url}</a></p>
        <p>If you didn’t sign up for Limis, you can ignore this email.</p>
        <hr style="margin: 30px 0;" />
        <small style="color: #888;">This email was sent by Limis. Please don’t reply directly to this message.</small>
      </div>
    `,
  });
}
