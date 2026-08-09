/**
 * The image types the API accepts, and the file extension each one is stored
 * under. The extension is derived from the (validated) content type rather than
 * taken from the uploaded filename — that filename is client-controlled and
 * ends up inside the public object key.
 */
export const EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
};

export const SVG_MIME = 'image/svg+xml';

/**
 * Leading bytes every accepted raster format must start with. The browser-sent
 * content type is just a claim; checking the signature stops a file being
 * stored (and later served) as a type it is not. SVG is text and has no useful
 * signature, so it is verified by being served as a download instead.
 */
const MAGIC_BY_MIME: Record<string, number[][]> = {
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  'image/x-icon': [[0x00, 0x00, 0x01, 0x00]],
};

/** RIFF/ISO-BMFF containers carry their real type a few bytes in. */
const CONTAINER_BY_MIME: Record<string, { offset: number; tag: string }> = {
  'image/webp': { offset: 8, tag: 'WEBP' },
  'image/avif': { offset: 8, tag: 'avif' },
};

export function matchesDeclaredType(buffer: Buffer, mime: string): boolean {
  const signatures = MAGIC_BY_MIME[mime];
  if (signatures) {
    return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
  }

  const container = CONTAINER_BY_MIME[mime];
  if (container) {
    return (
      buffer
        .subarray(container.offset, container.offset + container.tag.length)
        .toString('latin1') === container.tag
    );
  }

  // SVG: only assert that it parses as the XML/SVG text it claims to be.
  return mime === SVG_MIME ? /<svg[\s>]/i.test(buffer.subarray(0, 1024).toString('utf8')) : false;
}
