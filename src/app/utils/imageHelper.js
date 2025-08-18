export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.png";

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  console.log(baseURL)

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/\\/g, "/");

  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath.slice(1)
    : cleanPath;

  return `${baseURL}/${normalizedPath}`;
};
