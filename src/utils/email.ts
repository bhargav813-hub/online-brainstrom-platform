import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';
import dns from 'dns/promises';

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

  try {
    // 1. Manually resolve the IPv4 address of the SMTP host to bypass IPv6 ENETUNREACH completely
    const lookupResult = await dns.lookup(env.SMTP_HOST, { family: 4 });
    const ipv4Address = lookupResult.address;

    // 2. Create transporter using the explicit IPv4 address
    // @ts-ignore
    const transporter = nodemailer.createTransport({
      host: ipv4Address,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        // We MUST pass the original hostname so Google's TLS certificate validation doesn't fail against the IP address
        servername: env.SMTP_HOST
      }
    } as any);

    const mailOptions = {
      from: env.SMTP_FROM || `"Brainstorm Platform" <${env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email successfully sent to ${options.to}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${options.to}:`, error);
    throw error;
  }
};
