export interface TextMarkdownProps {
    content: string;
    style?: object;
}

export interface TextElement {
    key: string;
    type: 'text';
    text: string;
}

export interface BoldElement {
    key: string;
    type: 'bold';
    children: InlineElement[];
}

export interface ItalicElement {
    key: string;
    type: 'italic';
    children: InlineElement[];
}

export interface CodeElement {
    key: string;
    type: 'code';
    text: string;
}

export interface LinkElement {
    key: string;
    type: 'link';
    url: string;
    children: InlineElement[];
}

export interface InlineMathElement {
    key: string;
    type: 'inline_math';
    content: string;
}

export interface BlockMathElement {
    key: string;
    type: 'block_math';
    content: string;
}

export type InlineElement = TextElement | BoldElement | ItalicElement | CodeElement | LinkElement | InlineMathElement | BlockMathElement;

export interface ParagraphBlock {
    type: 'paragraph';
    key: string;
    children: InlineElement[];
}

export interface HeadingBlock {
    type: 'heading';
    key: string;
    level: number;
    children: InlineElement[];
}

export interface CodeBlock {
    type: 'code_block';
    key: string;
    language?: string;
    code: string;
}

export interface ListItemBlock {
    key: string;
    children: InlineElement[];
}

export interface ListBlock {
    type: 'list';
    key: string;
    ordered: boolean;
    items: ListItemBlock[];
}

export interface TableCell {
    key: string;
    children: InlineElement[];
}

export interface TableRow {
    key: string;
    cells: TableCell[];
}

export interface TableBlock {
    type: 'table';
    key: string;
    headers: TableCell[];
    rows: TableRow[];
}

export interface BlockMathBlock {
    type: 'block_math';
    key: string;
    content: string;
}

export interface HorizontalRuleBlock {
    type: 'horizontal_rule';
    key: string;
}

export type BlockElement = ParagraphBlock | HeadingBlock | CodeBlock | ListBlock | TableBlock | BlockMathBlock | HorizontalRuleBlock;

export type ParsedElement = BlockElement | InlineElement;

export interface ParseMarkerResult {
    elements: InlineElement[];
    rest: string;
    consumed: number;
}

export type MarkerHandler = (
    remaining: string,
    match: { index: number; type: string; len: number },
    counter: { current: number },
    recursiveParse: (text: string, counter: { current: number }) => InlineElement[],
    elements: InlineElement[]
) => ParseMarkerResult;

export const HANDLERS: Record<string, MarkerHandler> = {};

export function initHandlers (handlers: Record<string, MarkerHandler>): void {
    Object.assign(HANDLERS, handlers);
}

export interface RenderInlineElementProps {
    element: InlineElement;
}

export interface RenderBlockElementProps {
    element: BlockElement;
}
