/**
 * Converts a string into a URL-friendly slug.
 * Matches the format: /chat/{id}/{slug}
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
};
