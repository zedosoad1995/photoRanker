import { Area } from "react-easy-crop";
import Resizer from "react-image-file-resizer";
import { IMG_HEIGHT, IMG_WIDTH } from "@shared/constants/picture";

export const base64toBlob = (dataURL: string) => {
  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = (mimeMatch && mimeMatch[1]) || "image/jpeg";
  const byteString = atob(arr[1]);
  let arrayBuffer = new ArrayBuffer(byteString.length);
  let uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mime });
};

export const getImageDimensionsFromBase64 = (
  dataURL: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const width = image.width;
      const height = image.height;
      resolve({ width, height });
    };

    image.onerror = (error) => {
      reject(error);
    };

    const blob = base64toBlob(dataURL);

    image.src = URL.createObjectURL(blob);
  });
};

export const createHTMLImageFromBase64 = (dataURL: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = dataURL;
  });

export const getCroppedImage = async (dataURL: string, crop: Area): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error();
  }

  const image = await createHTMLImageFromBase64(dataURL);

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) {
    throw new Error();
  }

  croppedCanvas.width = crop.width;
  croppedCanvas.height = crop.height;
  croppedCtx.drawImage(
    canvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = (mimeMatch && mimeMatch[1]) || "image/jpeg";

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file) {
        resolve(file);
      } else {
        reject();
      }
    }, mime);
  });
};

export const resizeImage = (image: Blob): Promise<Blob> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      IMG_WIDTH,
      IMG_HEIGHT,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri as Blob);
      },
      "blob"
    );
  });
