import { parseThinkContent, THOUGHT_END_TAGS } from '@application/shared/parseThinkContent';

describe('parseThinkContent', () => {
    it('returns the whole text as content when there is no thought end tag', () => {
        expect(parseThinkContent('  just an answer  ')).toEqual({ content: '  just an answer  ' });
    });

    it.each(THOUGHT_END_TAGS)('splits the think from the content at %p', (tag) => {
        expect(parseThinkContent(` reasoning ${tag} answer `)).toEqual({
            think: { content: 'reasoning' },
            content: 'answer'
        });
    });

    it('splits at the earliest tag even when it comes later in the tag list', () => {
        expect(parseThinkContent('reasoning</thought>answer</think>tail')).toEqual({
            think: { content: 'reasoning' },
            content: 'answer</think>tail'
        });
    });

    it('keeps the first tag when a later listed tag appears after it', () => {
        expect(parseThinkContent('reasoning</think>answer</thought>tail')).toEqual({
            think: { content: 'reasoning' },
            content: 'answer</thought>tail'
        });
    });

    it('returns an empty think when the text starts with the end tag', () => {
        expect(parseThinkContent('</think>answer')).toEqual({ think: { content: '' }, content: 'answer' });
    });
});
