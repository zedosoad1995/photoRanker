export const dataURLtoBlob = (dataURL: string) => {
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
