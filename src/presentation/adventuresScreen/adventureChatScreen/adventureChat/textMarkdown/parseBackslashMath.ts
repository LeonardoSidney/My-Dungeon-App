import { InlineElement, ParseMarkerResult } from './constants';
import { createKey } from './parseInlineCore';

export function parseBackslashInlineMath (
    remaining: string,
    match: { index: number; type: string; len: number },
    counter: { current: number },
    _recursiveParse: (text: string, counter: { current: number }) => InlineElement[],
    elements: InlineElement[]
): ParseMarkerResult {
    const closeIndex = remaining.indexOf('\\)', match.index + 2);

    if (closeIndex === -1) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(match.index)
        });
        return { elements, rest: '', consumed: remaining.length };
    }

    const mathContent = remaining.slice(match.index + 2, closeIndex);
    elements.push({
        key: createKey('inline_math', counter),
        type: 'inline_math',
        content: mathContent
    });

    const rest = remaining.slice(closeIndex + 2);
    return { elements, rest, consumed: remaining.length - rest.length };
}

export function parseBackslashBlockMath (
    remaining: string,
    match: { index: number; type: string; len: number },
    counter: { current: number },
    _recursiveParse: (text: string, counter: { current: number }) => InlineElement[],
    elements: InlineElement[]
): ParseMarkerResult {
    const closeIndex = remaining.indexOf('\\]', match.index + 2);

    if (closeIndex === -1) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(match.index)
        });
        return { elements, rest: '', consumed: remaining.length };
    }

    const mathContent = remaining.slice(match.index + 2, closeIndex).trim();
    elements.push({
        key: createKey('block_math', counter),
        type: 'block_math',
        content: mathContent
    });

    const rest = remaining.slice(closeIndex + 2);
    return { elements, rest, consumed: remaining.length - rest.length };
}
