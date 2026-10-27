import { renderLatexWeb } from '@presentation/screens/adventures/chat/components/textMarkdown/renderLatex';

const REFUSED_COMMAND_COLOR = '#cc0000';

function refused (command: string): string {
    return `style="color:${REFUSED_COMMAND_COLOR};">${command}</span>`;
}

describe('renderLatexWeb', () => {
    it('renders plain math', () => {
        const html = renderLatexWeb('\\frac{a}{b}', false);

        expect(html).toContain('class="katex"');
        expect(html).toContain('mfrac');
    });

    it('shows a javascript link from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\href{javascript:alert(1)}{\\text{Continue}}', true);

        expect(html).toContain(refused('\\href'));
        expect(html).not.toMatch(/<a\s|href=/);
    });

    it('shows a plain url from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\url{https://attacker.example}', true);

        expect(html).toContain(refused('\\url'));
        expect(html).not.toMatch(/<a\s|href=/);
    });

    it('shows an external image from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\includegraphics[height=1em]{https://attacker.example/p.png}', true);

        expect(html).toContain(refused('\\includegraphics'));
        expect(html).not.toMatch(/<img|src=/);
    });

    it('shows a custom style from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\htmlStyle{position:fixed;inset:0}{x}', true);

        expect(html).toContain(refused('\\htmlStyle'));
        expect(html).not.toMatch(/style="[^"]*position:fixed/);
    });

    it('shows a custom class from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\htmlClass{overlay}{x}', true);

        expect(html).toContain(refused('\\htmlClass'));
        expect(html).not.toMatch(/class="[^"]*overlay/);
    });

    it('shows a custom id from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\htmlId{overlay}{x}', true);

        expect(html).toContain(refused('\\htmlId'));
        expect(html).not.toMatch(/id="overlay"/);
    });

    it('shows a custom data attribute from the chat as a refused command instead of html', () => {
        const html = renderLatexWeb('\\htmlData{action=steal}{x}', true);

        expect(html).toContain(refused('\\htmlData'));
        expect(html).not.toMatch(/data-action=/);
    });
});
