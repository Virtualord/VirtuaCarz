export const getImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `data:image/jpeg;base64,${image}`;
};
