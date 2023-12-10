import { EXTENSION_TO_MIME_TYPE } from "@/constants/picture";
import crypto from "crypto";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { BadRequestError } from "@/errors/BadRequestError";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseInteractor implements StorageInteractor {
  constructor(private supabaseClient: SupabaseClient) {}

  async saveNewImage(imageBuffer: Buffer, extension: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    const uniqueSuffix = crypto.randomBytes(18).toString("hex");
    const fileName = `${year}/${month}/${day}/${uniqueSuffix}.${extension}`;

    if (!(extension in EXTENSION_TO_MIME_TYPE)) {
      throw new BadRequestError(
        `Invalid extension. Can only be one of the following: ${Object.keys(
          EXTENSION_TO_MIME_TYPE
        ).join(", ")}`
      );
    }

    const res = await this.supabaseClient.storage
      .from(process.env.SUPABASE_BUCKET as string)
      .upload(fileName, imageBuffer, {
        contentType: EXTENSION_TO_MIME_TYPE[extension as keyof typeof EXTENSION_TO_MIME_TYPE],
      });

    if (res.error) {
      console.error(res);
    }

    return fileName;
  }

  public getBaseDir() {
    return process.env.SUPABASE_STORAGE_URL as string;
  }

  public getImageUrl(imagePath: string) {
    return `${this.getBaseDir()}/${decodeURI(imagePath).replace(/\\/g, "/")}`;
  }

  public async deleteImage(encodedImagePage: string) {
    const imagePath = decodeURI(encodedImagePage).replace(/\\/g, "/");

    const res = await this.supabaseClient.storage
      .from(process.env.SUPABASE_BUCKET as string)
      .remove([imagePath]);
    if (res.error) {
      console.error(res);
    }
  }
}
