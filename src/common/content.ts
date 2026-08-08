/**
 * Search/reading-time projection of markdown content.
 *
 * plainText feeds the posts.search generated tsvector column, so it must be
 * computed in application code (array_to_string/markdown stripping are not
 * IMMUTABLE in Postgres). Code text is intentionally kept — searching for an
 * identifier that only appears in a snippet should still match the post.
 */
export function markdownToPlainText(markdown: string, tags: string[] = []): string {
  const text = markdown
    // fenced code: drop the fence lines, keep the code text
    .replace(/^```[^\n]*$/gm, ' ')
    // display + inline math delimiters
    .replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ')
    .replace(/\$([^$\n]+)\$/g, ' $1 ')
    // images: keep alt + caption title
    .replace(/!\[([^\]]*)\]\([^)\s]*(?:\s+"([^"]*)")?\)/g, ' $1 $2 ')
    // links: keep the label
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // headings, blockquotes, list markers
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // GFM table separator rows, then cell pipes
    .replace(/^\|?[\s:|-]+\|[\s:|-]+$/gm, ' ')
    .replace(/\|/g, ' ')
    // emphasis / strikethrough / inline code markers
    .replace(/[*_~`]+/g, '')
    // raw html tags
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return tags.length ? `${text} ${tags.join(' ')}` : text;
}

export function readingTimeMin(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
