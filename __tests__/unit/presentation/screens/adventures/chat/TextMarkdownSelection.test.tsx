import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { TextMarkdown } from '@presentation/screens/adventures/chat/components/textMarkdown';

const selectionOf = (text: string | RegExp) => StyleSheet.flatten(screen.getByText(text).props.style).userSelect;

describe('TextMarkdown text selection', () => {
  it('lets the player select a paragraph', async () => {
    await render(<TextMarkdown content="A door creaks open." />);

    expect(selectionOf('A door creaks open.')).toBe('text');
  });

  it('lets the player select a heading', async () => {
    await render(<TextMarkdown content="# The Keep" />);

    expect(selectionOf('The Keep')).toBe('text');
  });

  it('lets the player select a list item', async () => {
    await render(<TextMarkdown content="- Torch" />);

    expect(selectionOf(/Torch/)).toBe('text');
  });

  it('lets the player select a code block', async () => {
    await render(<TextMarkdown content={'```\nroll 1d20\n```'} />);

    expect(selectionOf('roll 1d20')).toBe('text');
  });

  it('lets the player select a table cell', async () => {
    await render(<TextMarkdown content={'| Name |\n| --- |\n| Sword |'} />);

    expect(selectionOf('Sword')).toBe('text');
  });
});
