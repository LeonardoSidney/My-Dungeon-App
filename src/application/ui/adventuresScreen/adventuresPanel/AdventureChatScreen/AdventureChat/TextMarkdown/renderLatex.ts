import katex from 'katex';
import { Platform } from 'react-native';

const IS_WEB = Platform.OS === 'web';

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

export function isWebPlatform (): boolean {
    return IS_WEB;
}
