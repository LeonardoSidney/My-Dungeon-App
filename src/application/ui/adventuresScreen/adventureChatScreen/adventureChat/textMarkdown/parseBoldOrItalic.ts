import { InlineElement, ParseMarkerResult } from './constants';
import { createKey } from './parseInlineCore';

export function parseBoldOrItalic (
    remaining: string,
    match: { index: number; type: string; len: number },
    counter: { current: number },
    recursiveParse: (text: string, counter: { current: number }) => InlineElement[],
    elements: InlineElement[]
): ParseMarkerResult {
    const marker = remaining.slice(match.index, match.index + match.len);
    const closeIndex = remaining.indexOf(marker, match.index + match.len);

    if (closeIndex === -1) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(match.index)
        });
        return { elements, rest: '', consumed: remaining.length };
    }

    const content = remaining.slice(match.index + match.len, closeIndex);
    const children = recursiveParse(content, counter);

    const isBold = match.type === 'bold';
    const elementType = isBold ? 'bold' : 'italic';
    const element: InlineElement = {
        key: createKey(elementType, counter),
        type: elementType,
        children
    };
    elements.push(element);

    const rest = remaining.slice(closeIndex + match.len);
    return { elements, rest, consumed: remaining.length - rest.length };
}
