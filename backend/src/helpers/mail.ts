import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import ejs from "ejs";
import path from "path";
import { VIEWS_FOLDER_PATH } from "@/constants/email";

export const sendEmail = (options: Mail.Options) => {
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
};

export const getEmailHtml = async (emailPath: string, data: { [name: string]: any }) => {
  const templatePath = path.resolve(process.cwd(), VIEWS_FOLDER_PATH, emailPath);

  return ejs.renderFile(templatePath, data);
};
