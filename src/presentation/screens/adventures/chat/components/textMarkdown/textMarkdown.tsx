import React, { memo, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { LatexRendererBlock } from './latexRendererBlock';
import { LatexRendererInline } from './latexRendererInline';
import { parseMarkdown } from './parseMarkdown';
import { useOpenLink } from './useOpenLink';
import { TextMarkdownProps, InlineElement, MarkdownLinkProps, RenderInlineElementProps, RenderBlockElementProps } from './types';

const headingStylesMap: Record<number, object> = {
  1: styles.heading1,
  2: styles.heading2,
  3: styles.heading3,
  4: styles.heading4,
  5: styles.heading5,
  6: styles.heading6,
};

function MarkdownLink ({ element }: MarkdownLinkProps) {
  const openLink = useOpenLink();

  return (
    <TouchableOpacity
      accessibilityRole="link"
      onPress={() => {
        openLink(element);
      }}
    >
      <Text style={styles.link}>
        {element.children.map((child: InlineElement) => (
          <RenderInlineElement key={child.key} element={child} />
        ))}
      </Text>
    </TouchableOpacity>
  );
}

function RenderInlineElement ({ element }: RenderInlineElementProps): ReactNode {
  if (element.type === 'text') {
    return element.text;
  }

  if (element.type === 'code') {
    return (
      <Text key={element.key} style={styles.code}>
        {element.text}
      </Text>
    );
  }

  if (element.type === 'inline_math') {
    return <LatexRendererInline key={element.key} latex={element.content} />;
  }

  if (element.type === 'block_math') {
    return <LatexRendererBlock key={element.key} latex={element.content} />;
  }

  if (element.type === 'link') {
    return <MarkdownLink key={element.key} element={element} />;
  }

  if (element.type === 'bold' || element.type === 'italic') {
    const isBold = element.type === 'bold';
    const textStyle = isBold ? styles.bold : styles.italic;
    return (
      <Text key={element.key} style={textStyle}>
        {element.children.map((child: InlineElement) => (
          <RenderInlineElement key={child.key} element={child} />
        ))}
      </Text>
    );
  }

  return null;
}

function RenderBlockElement ({ element, textStyle }: RenderBlockElementProps): ReactNode {
  switch (element.type) {
    case 'paragraph':
      return (
        <Text key={element.key} style={[styles.text, styles.paragraph, textStyle]}>
          {element.children.map((child: InlineElement) => (
            <RenderInlineElement key={child.key} element={child} />
          ))}
        </Text>
      );

    case 'heading': {
      const levelStyle = headingStylesMap[element.level];
      const hasLevelStyle = Boolean(levelStyle);
      const headingStyle = hasLevelStyle ? [styles.text, textStyle, styles.heading, levelStyle] : [styles.text, textStyle, styles.heading];
      return (
        <Text key={element.key} style={headingStyle}>
          {element.children.map((child: InlineElement) => (
            <RenderInlineElement key={child.key} element={child} />
          ))}
        </Text>
      );
    }

    case 'code_block': {
      const hasLanguage = Boolean(element.language);
      const languageText = hasLanguage ? element.language : null;
      return (
        <View key={element.key} style={styles.codeBlock}>
          {hasLanguage && <Text style={styles.codeBlockLanguage}>{languageText}</Text>}
          <Text style={styles.codeBlockText}>{element.code}</Text>
        </View>
      );
    }

    case 'block_math':
      return <LatexRendererBlock key={element.key} latex={element.content} />;

    case 'horizontal_rule':
      return <View key={element.key} style={styles.horizontalRule} />;

    case 'list':
      return (
        <View key={element.key} style={styles.list}>
          {element.items.map((item, index) => {
            const isOrdered = element.ordered;
            const markerNumber = String(index + 1) + '. ';
            const listMarker = isOrdered ? markerNumber : '- ';
            return (
              <Text key={item.key} style={[styles.text, styles.listItem, textStyle]}>
                <Text style={styles.listMarker}>{listMarker}</Text>
                {item.children.map((child: InlineElement) => (
                  <RenderInlineElement key={child.key} element={child} />
                ))}
              </Text>
            );
          })}
        </View>
      );

    case 'table':
      return (
        <View key={element.key} style={styles.table}>
          <View style={styles.tableRow}>
            {element.headers.map((header) => (
              <View key={header.key} style={styles.tableHeaderCell}>
                <Text style={[styles.text, textStyle, styles.tableHeaderText]}>
                  {header.children.map((child: InlineElement) => (
                    <RenderInlineElement key={child.key} element={child} />
                  ))}
                </Text>
              </View>
            ))}
          </View>
          {element.rows.map((row) => (
            <View key={row.key} style={styles.tableRow}>
              {row.cells.map((cell) => (
                <View key={cell.key} style={styles.tableCell}>
                  <Text style={[styles.text, textStyle]}>
                    {cell.children.map((child: InlineElement) => (
                      <RenderInlineElement key={child.key} element={child} />
                    ))}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );

    default:
      return null;
  }
}

function TextMarkdownBase ({ content, style }: TextMarkdownProps) {
  const blocks = parseMarkdown(content);

  return (
    <>
      {blocks.map(block => (
        <RenderBlockElement key={block.key} element={block} textStyle={style} />
      ))}
    </>
  );
}

export const TextMarkdown = memo(TextMarkdownBase);
