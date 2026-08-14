import { InlineElement, ParseMarkerResult } from './constants';
import { createKey } from './parseInlineCore';

export function parseLink (
    remaining: string,
    match: { index: number; type: string; len: number },
    counter: { current: number },
    recursiveParse: (text: string, counter: { current: number }) => InlineElement[],
    elements: InlineElement[]
): ParseMarkerResult {
    const closeBracket = remaining.indexOf(']', match.index + 1);
    const hasValidSyntax = closeBracket !== -1 && remaining[closeBracket + 1] === '(';

    if (!hasValidSyntax) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(match.index)
        });
        return { elements, rest: '', consumed: remaining.length };
    }

    const closeParen = remaining.indexOf(')', closeBracket + 2);
    if (closeParen === -1) {
        elements.push({
            key: createKey('text', counter),
            type: 'text',
            text: remaining.slice(match.index)
        });
        return { elements, rest: '', consumed: remaining.length };
    }

    const linkText = remaining.slice(match.index + 1, closeBracket);
    const url = remaining.slice(closeBracket + 2, closeParen);
    const children = recursiveParse(linkText, counter);

    elements.push({
        key: createKey('link', counter),
        type: 'link',
        url,
        children
    });

    const rest = remaining.slice(closeParen + 1);
    return { elements, rest, consumed: remaining.length - rest.length };
}
