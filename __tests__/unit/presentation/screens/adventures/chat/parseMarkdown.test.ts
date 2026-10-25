import { parseMarkdown } from '@presentation/screens/adventures/chat/components/textMarkdown/parseMarkdown';

describe('parseMarkdown paragraphs', () => {
    it('keeps single line breaks inside a paragraph', () => {
        const [paragraph] = parseMarkdown('first line\nsecond line\nthird line');

        expect(paragraph).toMatchObject({
            type: 'paragraph',
            children: [{ type: 'text', text: 'first line\nsecond line\nthird line' }],
        });
    });

    it('keeps bold text that spans a line break', () => {
        const [paragraph] = parseMarkdown('**first\nsecond**');

        expect(paragraph).toMatchObject({
            type: 'paragraph',
            children: [{ type: 'bold', children: [{ type: 'text', text: 'first\nsecond' }] }],
        });
    });

    it('splits paragraphs on blank lines', () => {
        const blocks = parseMarkdown('first\n\nsecond');

        expect(blocks).toHaveLength(2);
        expect(blocks.every(block => block.type === 'paragraph')).toBe(true);
    });
});
