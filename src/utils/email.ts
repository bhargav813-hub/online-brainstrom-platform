import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';
import dns from 'dns';

// Force Node.js to prefer IPv4 over IPv6 when resolving hostnames
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// @ts-ignore
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  family: 4, // Force IPv4 resolution to fix ENETUNREACH IPv6 errors
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
} as any);

/**
 * Reusable email sender utility.
 * Configuration points to environment variables (e.g. Gmail App Passwords).
 * Automatically logs/mocks when credentials are not configured.
 */
export const sendEmail = async (options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<any> => {
  // If credentials are not configured, fallback to logging the email
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn(`[SMTP Config Missing] Email was NOT sent. Please configure SMTP_USER and SMTP_PASS in your .env file.`);
    logger.info(`[Email Mock] To: ${options.to} | Subject: ${options.subject} | OTP/Content: ${options.text}`);
    return { messageId: 'mock-id' };
  }

  const mailOptions = {
    from: env.SMTP_FROM || `"Brainstorm Platform" <${env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email successfully sent to ${options.to}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${options.to}:`, error);
    throw error;
  }
};
