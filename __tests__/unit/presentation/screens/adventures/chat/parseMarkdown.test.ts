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

describe('parseMarkdown links', () => {
    it('keeps a web link with the host it opens', () => {
        const [paragraph] = parseMarkdown('Read [the **rules**](https://example.com/rules) first');

        expect(paragraph).toMatchObject({
            type: 'paragraph',
            children: [
                { type: 'text', text: 'Read ' },
                {
                    type: 'link',
                    url: 'https://example.com/rules',
                    host: 'example.com',
                    children: [{ type: 'text', text: 'the ' }, { type: 'bold', children: [{ type: 'text', text: 'rules' }] }],
                },
                { type: 'text', text: ' first' },
            ],
        });
    });

    it('turns a link that is not a web link into its plain text', () => {
        const [paragraph] = parseMarkdown('Click [**Continue**](javascript:alert(1)) now');

        expect(paragraph).toMatchObject({
            type: 'paragraph',
            children: [
                { type: 'text', text: 'Click ' },
                { type: 'bold', children: [{ type: 'text', text: 'Continue' }] },
                { type: 'text', text: ') now' },
            ],
        });
        expect(JSON.stringify(paragraph)).not.toContain('"type":"link"');
    });
});
