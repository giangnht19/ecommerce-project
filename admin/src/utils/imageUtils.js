/**
 * Utility function to handle image URLs from the server
 * Converts localhost URLs to the production server URL
 */

export const getImageUrl = (imageUrl) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";
  
  // If the image URL is already absolute and valid, return it
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    // If it's a localhost URL and we're in production, replace it with the server URL
    if (imageUrl.includes('localhost') && serverUrl.includes('https://')) {
      return imageUrl.replace(/http:\/\/localhost:\d+/, serverUrl);
    }
    return imageUrl;
  }
  
  // If it's a relative path, prepend the server URL
  if (imageUrl && imageUrl.startsWith('/')) {
    return `${serverUrl}${imageUrl}`;
  }
  
  // Fallback for any other cases
  return imageUrl;
};

export const getImageUrlWithFallback = (imageUrl, fallbackImage = null) => {
  const processedUrl = getImageUrl(imageUrl);
  
  // Return the processed URL, or fallback if provided
  return processedUrl || fallbackImage;
};
