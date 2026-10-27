import { OpenableLink } from './types';

const HTTP_LINK_PATTERN = /^https?:\/\/([^/?#]+)/i;
const UNSAFE_LINK_CHARACTERS = /[\s\\]/;
const PLAIN_HOST_PATTERN = /^[a-z0-9.-]+(:\d+)?$/i;

export function toOpenableLink (url: string): OpenableLink | null {
    if (UNSAFE_LINK_CHARACTERS.test(url)) {
        return null;
    }

    const match = HTTP_LINK_PATTERN.exec(url);
    if (!match) {
        return null;
    }

    const host = match[1];
    if (!PLAIN_HOST_PATTERN.test(host)) {
        return null;
    }

    return { url, host };
}
