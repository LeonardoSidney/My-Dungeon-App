import { InlineElement, ParseMarkerResult } from './constants';
import { createKey } from './parseInlineCore';

export function parseCode (
    remaining: string,
    match: { index: number; type: string; len: number },
    counter: { current: number },
    _recursiveParse: (text: string, counter: { current: number }) => InlineElement[],
    elements: InlineElement[]
): ParseMarkerResult {
    const closeIndex = remaining.indexOf('`', match.index + 1);

    if (closeIndex === -1) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(match.index)
        });
        return { elements, rest: '', consumed: remaining.length };
    }

    const codeContent = remaining.slice(match.index + 1, closeIndex);
    elements.push({
        key: createKey('code', counter),
        type: 'code',
        text: codeContent
    });

    const rest = remaining.slice(closeIndex + 1);
    return { elements, rest, consumed: remaining.length - rest.length };
}
