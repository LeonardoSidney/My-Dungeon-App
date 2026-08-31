import katex from 'katex';

export function renderLatexWeb (
    latex: string,
    displayMode: boolean
): string {
    const rendered = katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
    });

    return rendered;
}
