export interface StorageInteractor {
  saveNewImage: (imageBuffer: Buffer, extension: string) => Promise<string>;
  getImage: (imagePath: string) => string;
}
