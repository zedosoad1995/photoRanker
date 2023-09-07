import ejs from "ejs";
import path from "path";
import { VIEWS_FOLDER_PATH } from "@/constants/email";

const basePath = __dirname.includes(path.sep + "backend")
  ? __dirname.split(path.sep + "backend")[0]
  : __dirname;

export const getEmailHtml = async (emailPath: string, data: { [name: string]: any }) => {
  const templatePath = path.resolve(basePath, "backend", VIEWS_FOLDER_PATH, emailPath);

  return ejs.renderFile(templatePath, data);
};
