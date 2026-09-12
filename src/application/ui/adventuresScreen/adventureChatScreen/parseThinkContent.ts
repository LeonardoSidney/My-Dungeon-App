import { Think } from '@domain/entities';

export const THOUGHT_END_TAGS = ['</think>', '</thought>', '</thought_end>', '<channel|>', 'to=user<|message|>'];

export function parseThinkContent (fullText: string): { think?: Think; content: string } {
    let earliestIndex = -1;
    let endTag = '';

    for (const tag of THOUGHT_END_TAGS) {
        const index = fullText.indexOf(tag);
        if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
            earliestIndex = index;
            endTag = tag;
        }
    }

    if (earliestIndex !== -1) {
        const thinkContent = fullText.substring(0, earliestIndex).trim();
        const content = fullText.substring(earliestIndex + endTag.length).trim();
        return {
            think: {
                id: Date.now().toString(),
                content: thinkContent,
                enabled: true,
            },
            content,
        };
    }
    return { content: fullText };
}
