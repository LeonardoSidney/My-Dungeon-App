import { BlockElement, InlineElement } from './constants';
import { parseInlineMarkdown } from './parseInlineCore';

export function parseMarkdown (input: string): BlockElement[] {
    const blocks: BlockElement[] = [];
    const lines = input.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.trim() === '') {
            i++;
            continue;
        }

        if (/^(\s{0,3})[-*_](\s*[-*_]){2,}$/.test(line)) {
            blocks.push({
                type: 'horizontal_rule',
                key: `horizontal_rule-${blocks.length}`
            });
            i++;
            continue;
        }

        if (line.trimStart().startsWith('```')) {
            const language = line.trimStart().slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            if (i < lines.length) {
                i++;
            }
            blocks.push({
                type: 'code_block',
                key: `code_block-${blocks.length}`,
                language: language || undefined,
                code: codeLines.join('\n')
            });
            continue;
        }

        if (line.trimStart().startsWith('$$')) {
            const mathLines: string[] = [];
            const firstLine = line.trimStart().slice(2);

            const closeIndex = firstLine.indexOf('$$');
            const isSingleLine = closeIndex !== -1;

            if (isSingleLine) {
                const sameLineContent = firstLine.slice(0, closeIndex).trim();
                if (sameLineContent !== '') {
                    mathLines.push(sameLineContent);
                }
                i++;
            }

            if (!isSingleLine) {
                if (firstLine.trim() !== '') {
                    mathLines.push(firstLine);
                }
                i++;
                while (i < lines.length) {
                    const currentLine = lines[i];
                    if (currentLine.includes('$$')) {
                        const beforeClose = currentLine.slice(0, currentLine.indexOf('$$'));
                        if (beforeClose.trim() !== '') {
                            mathLines.push(beforeClose);
                        }
                        i++;
                        break;
                    }
                    mathLines.push(currentLine);
                    i++;
                }
            }
            blocks.push({
                type: 'block_math',
                key: `block_math-${blocks.length}`,
                content: mathLines.join('\n')
            });
            continue;
        }

        if (line.trimStart().startsWith('\\[')) {
            const mathLines: string[] = [];
            const firstLine = line.trimStart().slice(2);

            const closeIndex = firstLine.indexOf('\\]');
            const isSingleLine = closeIndex !== -1;

            if (isSingleLine) {
                const sameLineContent = firstLine.slice(0, closeIndex).trim();
                if (sameLineContent !== '') {
                    mathLines.push(sameLineContent);
                }
                i++;
            }

            if (!isSingleLine) {
                if (firstLine.trim() !== '') {
                    mathLines.push(firstLine);
                }
                i++;
                while (i < lines.length) {
                    const currentLine = lines[i];
                    if (currentLine.includes('\\]')) {
                        const beforeClose = currentLine.slice(0, currentLine.indexOf('\\]'));
                        if (beforeClose.trim() !== '') {
                            mathLines.push(beforeClose);
                        }
                        i++;
                        break;
                    }
                    mathLines.push(currentLine);
                    i++;
                }
            }
            blocks.push({
                type: 'block_math',
                key: `block_math-${blocks.length}`,
                content: mathLines.join('\n')
            });
            continue;
        }

        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const content = headingMatch[2];
            blocks.push({
                type: 'heading',
                key: `heading-${blocks.length}`,
                level,
                children: parseInlineMarkdown(content)
            });
            i++;
            continue;
        }

        if (/^\s*[-*+]\s+/.test(line)) {
            const items: { key: string; children: InlineElement[] }[] = [];
            while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
                const itemMatch = lines[i].match(/^\s*[-*+]\s+(.*)$/);
                if (itemMatch) {
                    items.push({
                        key: `item-${items.length}`,
                        children: parseInlineMarkdown(itemMatch[1])
                    });
                }
                i++;
            }
            blocks.push({
                type: 'list',
                key: `list-${blocks.length}`,
                ordered: false,
                items
            });
            continue;
        }

        const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);
        if (orderedMatch) {
            const items: { key: string; children: InlineElement[] }[] = [];
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                const itemMatch = lines[i].match(/^\s*\d+\.\s+(.*)$/);
                if (itemMatch) {
                    items.push({
                        key: `item-${items.length}`,
                        children: parseInlineMarkdown(itemMatch[1])
                    });
                }
                i++;
            }
            blocks.push({
                type: 'list',
                key: `list-${blocks.length}`,
                ordered: true,
                items
            });
            continue;
        }

        const tableHeaderMatch = line.match(/^\|(.+)\|$/);
        if (tableHeaderMatch && i + 1 < lines.length) {
            const separatorLine = lines[i + 1];
            if (/^\|([\s:-]+\|)+$/.test(separatorLine)) {
                const headerCells = tableHeaderMatch[1].split('|').map((cell, idx) => ({
                    key: `header-${idx}`,
                    children: parseInlineMarkdown(cell.trim())
                }));
                const rows: { key: string; cells: { key: string; children: InlineElement[] }[] }[] = [];
                i += 2;
                while (i < lines.length && /^\|(.+)\|$/.test(lines[i])) {
                    const rowMatch = lines[i].match(/^\|(.+)\|$/);
                    if (rowMatch) {
                        const rowCells = rowMatch[1].split('|').map((cell, idx) => ({
                            key: `cell-${rows.length}-${idx}`,
                            children: parseInlineMarkdown(cell.trim())
                        }));
                        rows.push({
                            key: `row-${rows.length}`,
                            cells: rowCells
                        });
                    }
                    i++;
                }
                blocks.push({
                    type: 'table',
                    key: `table-${blocks.length}`,
                    headers: headerCells,
                    rows
                });
                continue;
            }
        }

        const paragraphLines: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !lines[i].trimStart().startsWith('```') &&
            !lines[i].match(/^(#{1,6})\s+/) &&
            !/^\s*[-*+]\s+/.test(lines[i]) &&
            !/^\s*\d+\.\s+/.test(lines[i])
        ) {
            paragraphLines.push(lines[i]);
            i++;
        }

        if (paragraphLines.length > 0) {
            blocks.push({
                type: 'paragraph',
                key: `paragraph-${blocks.length}`,
                children: parseInlineMarkdown(paragraphLines.join(' '))
            });
        }
    }

    return blocks;
}

export { parseInlineMarkdown };
