import { MailRepo } from "@/types/mailRepo";
import sgMail from "@sendgrid/mail";

export class SendGridRepo implements MailRepo {
  async sendEmail(options: {
    to: string;
    from: { email: string; name: string };
    subject: string;
    html: string;
    text: string;
  }) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      to: options.to,
      from: options.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    return sgMail.send(msg);
  }
}
