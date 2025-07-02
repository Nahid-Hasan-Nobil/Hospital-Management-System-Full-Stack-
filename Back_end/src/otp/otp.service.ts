import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
 
@Injectable()
export class OtpService {
  private otps = new Map<string, string>();
 
  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(email, otp);
 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nobil921@gmail.com',
        pass: 'wvbj sfjq fgsa xldr',
      },
    });
 
    await transporter.sendMail({
      from: '"Hospital System" <nobil921@gmail.com>',
      to: email,
      subject: 'OTP for Password Change',
      text: `Your OTP is ${otp}`,
    });
 
    return { message: 'OTP sent to email' };
  }
 
  verifyOtp(email: string, otp: string): boolean {
    return this.otps.get(email) === otp;
  }
 
  clearOtp(email: string) {
    this.otps.delete(email);
  }
}