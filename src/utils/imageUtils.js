const images = import.meta.glob(
  "../assets/images/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

export const getDishImage = (imageName) => {
  if (!imageName) return "";

  const imagePath = Object.keys(images).find((path) =>
    path.toLowerCase().includes(
      `${imageName.toLowerCase()}.`
    )
  );

  return imagePath ? images[imagePath] : "";
};