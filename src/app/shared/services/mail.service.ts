import { createTransport } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private appURL: string;
  private from: string;
  private smtpHost: string;
  private smtpPort: number;
  private smtpUser: string;
  private smtpPass: string;
  constructor(private readonly configService: ConfigService) {
    this.appURL = this.configService.get<string>('app.url');

    this.from = this.configService.get<string>('email.from');

    this.smtpHost = this.configService.get<string>('email.smtp.host');
    this.smtpPort = this.configService.get<number>('email.smtp.port');
    this.smtpUser = this.configService.get<string>('email.smtp.user');
    this.smtpPass = this.configService.get<string>('email.smtp.pass');
  }

  async sendEmail(to: string, subject: string, text: string): Promise<any> {
    const transport = createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });
    // Create the email options and body
    const mailOptions = {
      from: `Blacked Shop < ${this.from} >`,
      to,
      subject,
      text,
    };

    // Set up the email options and delivering it
    return await transport.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<any> {
    const subject = 'Reset Password';
    const resetPasswordURL = `${this.appURL}/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${resetPasswordURL}
    If you did not request any password resets, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendAfterResetPasswordEmail(to: string): Promise<any> {
    const subject = 'Password Reset Successfully';
    const text = `Dear user,
    Your password has been reset successfully.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendVerifyEmail(to: string, token: string): Promise<any> {
    const subject = 'Email Verification';
    const verifyEmailURL = `${this.appURL}/verify-email?token=${token}`;
    const text = `Dear user,
    To verify your email, click on this link: ${verifyEmailURL}
    If you did not request any email verification, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }

  async sendForgotPasswordEmail(to: string, token: string): Promise<any> {
    const subject = 'Forgot Password';
    const forgotPasswordURL = `${this.appURL}/forgot-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${forgotPasswordURL}
    If you did not request any password resets, then ignore this email.`;

    return await this.sendEmail(to, subject, text);
  }
}
