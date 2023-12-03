export interface StorageInteractor {
  saveNewImage: (imageBuffer: Buffer, extension: string) => Promise<string>;
  getBaseDir: () => string;
  getImageUrl: (imagePath: string) => string;
  deleteImage: (encodedImagePage: string) => Promise<void>;
}
