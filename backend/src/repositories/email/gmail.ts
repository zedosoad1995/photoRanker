import { MailRepo } from "@/types/mailRepo";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class GmailRepo implements MailRepo {
  async sendEmail(options: Mail.Options) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      // TODO: Remove this unsafe option in the future for production
      tls: {
        rejectUnauthorized: false,
      },
    });

    return transporter.sendMail(options);
  }
}
