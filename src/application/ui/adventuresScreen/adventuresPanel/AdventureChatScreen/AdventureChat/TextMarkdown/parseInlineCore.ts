import { InlineElement, initHandlers, HANDLERS, ParseMarkerResult } from './constants';
import { parseBoldOrItalic } from './parseBoldOrItalic';
import { parseCode } from './parseCode';
import { parseInlineMath, parseBlockMathInline } from './parseMath';
import { parseBackslashInlineMath, parseBackslashBlockMath } from './parseBackslashMath';
import { parseLink } from './parseLink';

export function createKey (prefix: string, counter: { current: number }): string {
    return `${prefix}-${counter.current++}`;
}

function findEarliestMarker (text: string): { index: number; type: string; len: number } | null {
    let earliestIndex = -1;
    let earliestType = '';
    let earliestLen = 0;

    const patterns = [
        { pattern: '`', len: 1, type: 'code' },
        { pattern: '**', len: 2, type: 'bold' },
        { pattern: '__', len: 2, type: 'bold' },
        { pattern: '*', len: 1, type: 'italic' },
        { pattern: '_', len: 1, type: 'italic' },
        { pattern: '[', len: 1, type: 'link' },
        { pattern: '$$', len: 2, type: 'block_math' },
        { pattern: '$', len: 1, type: 'inline_math' },
        { pattern: '\\(', len: 2, type: 'backslash_inline_math' },
        { pattern: '\\[', len: 2, type: 'backslash_block_math' }
    ];

    for (const { pattern, len, type } of patterns) {
        const idx = text.indexOf(pattern);
        if (idx !== -1 && (earliestIndex === -1 || idx < earliestIndex)) {
            earliestIndex = idx;
            earliestType = type;
            earliestLen = len;
        }
    }

    if (earliestIndex === -1) {
        return null;
    }

    return { index: earliestIndex, type: earliestType, len: earliestLen };
}

function parseInline (text: string, counter: { current: number }): InlineElement[] {
    const elements: InlineElement[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        const match = findEarliestMarker(remaining);

        const result = parseMarker(remaining, match, counter, parseInline);
        if (result.consumed === remaining.length) {
            elements.push(...result.elements);
            break;
        }

        elements.push(...result.elements);
        remaining = result.rest;
    }

    return elements;
}

function parseMarker (
    remaining: string,
    match: { index: number; type: string; len: number } | null,
    counter: { current: number },
    recursiveParse: (text: string, counter: { current: number }) => InlineElement[]
): ParseMarkerResult {
    if (match === null) {
        const elements: InlineElement[] = [{
            key: createKey('text', counter),
            type: 'text',
            text: remaining
        }];
        return { elements, rest: '', consumed: remaining.length };
    }

    const elements: InlineElement[] = [];

    if (match.index > 0) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(0, match.index)
        });
    }

    const handler = HANDLERS[match.type] ?? parseBoldOrItalic;
    return handler(remaining, match, counter, recursiveParse, elements);
}

initHandlers({
    code: parseCode,
    inline_math: parseInlineMath,
    block_math: parseBlockMathInline,
    backslash_inline_math: parseBackslashInlineMath,
    backslash_block_math: parseBackslashBlockMath,
    link: parseLink
});

export function parseInlineMarkdown (text: string): InlineElement[] {
    const counter = { current: 0 };
    return parseInline(text, counter);
}
