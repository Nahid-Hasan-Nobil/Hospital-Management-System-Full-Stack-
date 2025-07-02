import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // using Gmail
      auth: {
        user: 'nobil921@gmail.com', // your Gmail address
        pass: 'wvbj sfjq fgsa xldr', // App password if 2FA is enabled
      },
    });
  }

  async sendRegistrationEmail(to: string, doctorName: string) {
    const mailOptions = {
      from: '"Hospital System" <nobil921@gmail.com>', // Sender info
      to: to, // Recipient doctor’s email
      subject: 'Registration Successful',
      text: `Dear  ${doctorName},

Welcome to the Hospital System! Your registration has been successfully completed.

You can now log in and start using our services.

If you have any questions, feel free to reach out.

Best regards,
The Hospital Team`,
      html: `<p>Dear Dr. <b>${doctorName}</b>,</p>
             <p>Welcome to the Hospital System! Your registration has been successfully completed.</p>
             <p>You can now log in and start using our services.</p>
             <p>If you have any questions, feel free to reach out.</p>
             <p>Best regards,<br/>The Hospital Team</p>`
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Registration email sent:', result.response);
      return result;
    } catch (error) {
      console.error('Error sending registration email:', error);
      throw new Error('Failed to send registration email');
    }
  }
}
