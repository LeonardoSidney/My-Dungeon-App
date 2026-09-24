import { IHashProvider } from '@domain/providers';

/* eslint-disable no-bitwise */

const ROTATIONS: number[] = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

const SINE_TABLE: number[] = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
];

function pushUtf8Bytes (bytes: number[], code: number): void {
    if (code < 0x80) {
        bytes.push(code);

        return;
    }

    if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));

        return;
    }

    if (code < 0x10000) {
        bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));

        return;
    }

    bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
    );
}

function toUtf8Bytes (value: string): Uint8Array {
    const bytes: number[] = [];

    for (const char of value) {
        pushUtf8Bytes(bytes, char.codePointAt(0) ?? 0);
    }

    return new Uint8Array(bytes);
}

function roundValues (t: number, b: number, c: number, d: number): { f: number; g: number; } {
    if (t < 16) {
        return { f: (b & c) | (~b & d), g: t };
    }

    if (t < 32) {
        return { f: (d & b) | (~d & c), g: (5 * t + 1) % 16 };
    }

    if (t < 48) {
        return { f: b ^ c ^ d, g: (3 * t + 5) % 16 };
    }

    return { f: c ^ (b | ~d), g: (7 * t) % 16 };
}

function digestBytes (bytes: Uint8Array): number[] {
    const bitLength = bytes.length * 8;
    const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
    const padded = new Uint8Array(paddedLength);

    padded.set(bytes);
    padded[bytes.length] = 0x80;

    const view = new DataView(padded.buffer);
    view.setUint32(paddedLength - 8, bitLength, true);
    view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    for (let offset = 0; offset < paddedLength; offset += 64) {
        const block = new Int32Array(16);
        for (let i = 0; i < 16; i++) {
            block[i] = view.getInt32(offset + i * 4, true);
        }

        let aa = a;
        let bb = b;
        let cc = c;
        let dd = d;

        for (let t = 0; t < 64; t++) {
            const { f, g } = roundValues(t, b, c, d);
            const q = (a + f + SINE_TABLE[t] + block[g]) | 0;
            a = d;
            d = c;
            c = b;
            b = (b + ((q << ROTATIONS[t]) | (q >>> (32 - ROTATIONS[t])))) | 0;
        }

        a = (a + aa) | 0;
        b = (b + bb) | 0;
        c = (c + cc) | 0;
        d = (d + dd) | 0;
    }

    const digest: number[] = [];
    const words = [a, b, c, d];

    for (const word of words) {
        digest.push(word & 0xff, (word >> 8) & 0xff, (word >> 16) & 0xff, (word >> 24) & 0xff);
    }

    return digest;
}

export class MD5Provider implements IHashProvider {
    md5 (value: string): string {
        const digest = digestBytes(toUtf8Bytes(value));
        return digest.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }
}
