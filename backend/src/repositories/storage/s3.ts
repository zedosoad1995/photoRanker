import { EXTENSION_TO_MIME_TYPE } from "@/constants/picture";
import crypto from "crypto";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { BadRequestError } from "@/errors/BadRequestError";
import { PutObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class S3Interactor implements StorageInteractor {
  constructor(private s3: S3Client) {}

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

    const params = {
      Bucket: process.env.IMAGES_BUCKET as string,
      Key: fileName,
      Body: imageBuffer,
      ContentType: EXTENSION_TO_MIME_TYPE[extension as keyof typeof EXTENSION_TO_MIME_TYPE],
    };

    await this.s3.send(new PutObjectCommand(params));

    return fileName;
  }

  public getImageUrl(imagePath: string) {
    return `https://${process.env.IMAGES_BUCKET}.s3.${
      process.env.S3_REGION
    }.amazonaws.com/${decodeURI(imagePath).replace(/\\/g, "/")}`;
  }

  public async deleteImage(encodedImagePage: string) {
    const key = decodeURI(encodedImagePage).replace(/\\/g, "/");

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.IMAGES_BUCKET as string,
          Key: key,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }
}
