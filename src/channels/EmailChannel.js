// src/channels/EmailChannel.js
const nodemailer = require('nodemailer');
const { getTemplate } = require('../templates/registry');

/**
 * Simple email channel that renders a Handlebars template and sends via Nodemailer.
 * In production you can replace the transporter with any provider (Resend, SendGrid, etc.).
 */
class EmailChannel {
  constructor() {
    // Basic SMTP transporter – replace env variables with real credentials.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password',
      },
    });
  }

  /**
   * Send an email using a pre‑compiled template.
   * @param {string} templateKey key as stored in TemplateRegistry (e.g., 'auth.welcome')
   * @param {object} to { email: string, name?: string }
   * @param {object} data variables for Handlebars rendering
   */
  async send(templateKey, to, data) {
    const template = getTemplate(templateKey);
    if (!template) {
      throw new Error(`Template not found for key: ${templateKey}`);
    }
    const html = template(data);
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@fortspace.com',
      to: to.email,
      subject: data.subject || 'Notification from FortSpace',
      html,
    };
    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailChannel();
