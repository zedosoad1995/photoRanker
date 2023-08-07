import { EXTENSION_TO_MIME_TYPE } from "@/constants/picture";
import sharp from "sharp";
import crypto from "crypto";
import { IMG_HEIGHT, IMG_WIDTH } from "@shared/constants/picture";
import { StorageInteractor } from "@/types/StorageInteractor";
import { BadRequestError } from "@/errors/BadRequestError";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3Interactor implements StorageInteractor {
  constructor(private s3: S3Client) {}

  async saveNewImage(imageBuffer: Buffer, extension: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    const uniqueSuffix = crypto.randomBytes(18).toString("hex");
    const fileName = `${year}/${month}/${day}/${uniqueSuffix}.${extension}`;

    const resizedImageBuffer = await sharp(imageBuffer).resize(IMG_WIDTH, IMG_HEIGHT).toBuffer();

    if (!(extension in EXTENSION_TO_MIME_TYPE)) {
      throw new BadRequestError(
        `Invalid extension. Can only be one of the following: ${Object.keys(
          EXTENSION_TO_MIME_TYPE
        ).join(", ")}`
      );
    }

    const params = {
      Bucket: process.env.IMAGES_BUCKET as string,
      Key: fileName,
      Body: resizedImageBuffer,
      ContentType: EXTENSION_TO_MIME_TYPE[extension as keyof typeof EXTENSION_TO_MIME_TYPE],
    };

    await this.s3.send(new PutObjectCommand(params));

    return fileName;
  }
}
