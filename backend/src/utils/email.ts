import { logger } from './logger';

interface WelcomeEmailParams {
  to: string;
  firstName: string;
  tenantName: string;
  loginUrl: string;
  temporaryPassword: string;
}

export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  // Stub: integrate with SendGrid/SES in production
  logger.info('Welcome email queued', {
    to: params.to,
    tenant: params.tenantName,
    subject: `Welcome to RecoverFlow — ${params.tenantName}`,
    body: `Hello ${params.firstName},\n\nYour organization "${params.tenantName}" has been created.\n\nLogin: ${params.loginUrl}\nEmail: ${params.to}\nTemporary Password: ${params.temporaryPassword}\n\nYou will be required to change your password on first login.`,
  });
}
