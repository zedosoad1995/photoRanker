import ejs from "ejs";
import path from "path";
import { VIEWS_FOLDER_PATH } from "@/constants/email";

export const getEmailHtml = async (emailPath: string, data: { [name: string]: any }) => {
  const templatePath = path.resolve(process.cwd(), VIEWS_FOLDER_PATH, emailPath);

  return ejs.renderFile(templatePath, data);
};
