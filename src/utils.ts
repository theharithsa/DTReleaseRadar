// src/utils.ts
export function extractImagesFromHtml(html: string): string[] {
  const imgRegex = /<img [^>]*src=['"]([^'"]+)['"][^>]*>/g;
  const images: string[] = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }
  return images;
}

export function summarizeHtmlContent(html: string, maxLen: number = 300): string {
  // Remove HTML tags for a plain-text summary
  const text = html.replace(/<[^>]*>?/gm, '');
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}