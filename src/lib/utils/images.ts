/**
 * Encodes a list of image URLs for storage in the `image_url` text column.
 * Single URL → plain string. Multiple → JSON array string.
 * No schema change needed — works with the existing `image_url text` column.
 */
export function encodeImageUrls(urls: string[]): string | null {
  if (urls.length === 0) return null
  if (urls.length === 1) return urls[0]
  return JSON.stringify(urls)
}

/**
 * Decodes image URLs from the `image_url` column.
 * Handles: plain URL, JSON array string, or null/undefined.
 */
export function decodeImageUrls(image_url: string | null | undefined): string[] {
  if (!image_url) return []
  if (image_url.startsWith('[')) {
    try { return JSON.parse(image_url) as string[] } catch { /* fall through */ }
  }
  return [image_url]
}
