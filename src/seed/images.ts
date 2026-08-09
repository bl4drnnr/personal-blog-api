/**
 * Image bytes for the dev seeder, built by hand because the API has no image
 * dependency and does not need one. These are real files, not placeholders:
 * they pass the upload signature check in `assets/mime.ts` and decode in a
 * browser, so the admin grid and the blog show actual pictures.
 *
 * Everything is a pure function of the index. Object keys are content hashes,
 * so deterministic bytes mean re-seeding overwrites the same objects instead of
 * littering the bucket with near-duplicates.
 */
import { deflateSync } from 'zlib';

// --- PNG ---------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let c = -1;
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

type Rgb = [number, number, number];

/** 8-bit truecolour PNG carrying a diagonal gradient, so thumbnails differ. */
export function png(width: number, height: number, [r, g, b]: Rgb): Buffer {
  const raw = Buffer.alloc(height * (1 + width * 3));
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0; // filter type: none
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const t = (x / width + y / height) / 2;
      const shade = 0.45 + 0.55 * t;
      raw[offset] = Math.round(r * shade);
      raw[offset + 1] = Math.round(g * shade);
      raw[offset + 2] = Math.round(b * shade);
      offset += 3;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 6 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- GIF ---------------------------------------------------------------------

/**
 * Single-colour GIF89a. The pixel block is genuine LZW — clear code, one code
 * per pixel, end of information — which is what makes it decodable rather than
 * merely correct in its header.
 */
export function gif(width: number, height: number, [r, g, b]: Rgb): Buffer {
  const screen = Buffer.alloc(7);
  screen.writeUInt16LE(width, 0);
  screen.writeUInt16LE(height, 2);
  screen[4] = 0x80; // global colour table, two entries
  const palette = Buffer.from([r, g, b, 0, 0, 0]);

  const descriptor = Buffer.alloc(10);
  descriptor[0] = 0x2c;
  descriptor.writeUInt16LE(width, 5);
  descriptor.writeUInt16LE(height, 7);

  const minCodeSize = 2;
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = end + 1;

  const bits: number[] = [];
  const emit = (code: number) => {
    for (let i = 0; i < codeSize; i += 1) {
      bits.push((code >> i) & 1);
    }
  };

  emit(clear);
  for (let i = 0; i < width * height; i += 1) {
    emit(0);
    nextCode += 1;
    if (nextCode === 1 << codeSize && codeSize < 12) {
      codeSize += 1;
    }
  }
  emit(end);

  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j += 1) {
      byte |= bits[i + j] << j;
    }
    bytes.push(byte);
  }

  const blocks: Buffer[] = [];
  for (let i = 0; i < bytes.length; i += 255) {
    const slice = bytes.slice(i, i + 255);
    blocks.push(Buffer.from([slice.length, ...slice]));
  }

  return Buffer.concat([
    Buffer.from('GIF89a', 'latin1'),
    screen,
    palette,
    descriptor,
    Buffer.from([minCodeSize]),
    ...blocks,
    Buffer.from([0x00, 0x3b]),
  ]);
}

// --- SVG ---------------------------------------------------------------------

export function svg(width: number, height: number, [r, g, b]: Rgb, label: string): Buffer {
  const safe = label.replace(/[<>&]/g, '');
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
      `viewBox="0 0 ${width} ${height}">` +
      `<rect width="${width}" height="${height}" fill="rgb(${r},${g},${b})"/>` +
      `<text x="50%" y="50%" fill="#ffffff" font-family="monospace" font-size="16" ` +
      `text-anchor="middle" dominant-baseline="middle">${safe}</text>` +
      `</svg>`,
    'utf8',
  );
}

// --- palette -----------------------------------------------------------------

/**
 * A hue per index rather than a repeating palette: a palette that cycles will
 * eventually pair the same colour with the same dimensions, and identical bytes
 * hash to one key, so the seeder would silently store fewer assets than it
 * generated.
 */
export function hue(index: number): Rgb {
  const sector = ((index * 47) % 360) / 60;
  const chroma = 0.42;
  const x = chroma * (1 - Math.abs((sector % 2) - 1));
  const [r, g, b]: Rgb =
    sector < 1
      ? [chroma, x, 0]
      : sector < 2
        ? [x, chroma, 0]
        : sector < 3
          ? [0, chroma, x]
          : sector < 4
            ? [0, x, chroma]
            : sector < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const lift = 0.28;
  return [
    Math.round((r + lift) * 255),
    Math.round((g + lift) * 255),
    Math.round((b + lift) * 255),
  ];
}
