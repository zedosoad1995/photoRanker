import ejs from "ejs";
import path from "path";
import { VIEWS_FOLDER_PATH } from "@/constants/email";
import { BACKEND_PATH } from "@/constants/path";

export const getEmailHtml = async (emailPath: string, data: { [name: string]: any }) => {
  const templatePath = path.resolve(BACKEND_PATH, VIEWS_FOLDER_PATH, emailPath);

  return ejs.renderFile(templatePath, data);
};
