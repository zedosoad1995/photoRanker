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
