import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MessageInput } from '@presentation/screens/adventures/chat/components/MessageInput';
import { colors } from '@presentation/theme';

describe('MessageInput', () => {
  it('shows the selected text while typing', async () => {
    await render(
      <MessageInput
        value=""
        onChangeText={jest.fn()}
        onKeyPress={jest.fn()}
        isStreaming={false}
        onSend={jest.fn()}
        onStop={jest.fn()}
        canSkipTurn={false}
        onSkipTurn={jest.fn()}
        onResend={jest.fn()}
        characters={[]}
        onCharacterSelect={jest.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('Type a message...').props.selectionColor).toBe(colors.primary);
  });
});
