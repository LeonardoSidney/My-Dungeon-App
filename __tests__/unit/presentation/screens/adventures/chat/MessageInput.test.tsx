import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AdventureChatCharacter } from '@domain/controllers';
import { MessageInput } from '@presentation/screens/adventures/chat/components/MessageInput';
import { colors } from '@presentation/theme';

const richard = { id: 'richard', name: 'Richard Jones' } as AdventureChatCharacter;

async function setup (value: string, isStreaming = false) {
  await render(
    <MessageInput
      value={value}
      onChangeText={jest.fn()}
      onKeyPress={jest.fn()}
      isStreaming={isStreaming}
      onSend={jest.fn()}
      onStop={jest.fn()}
      canSkipTurn={false}
      onSkipTurn={jest.fn()}
      onResend={jest.fn()}
      characters={[richard]}
      selectedCharacter={richard}
      onCharacterSelect={jest.fn()}
    />,
  );
}

describe('MessageInput', () => {
  it('shows the selected text while typing', async () => {
    await setup('');

    expect(screen.getByPlaceholderText('Type a message...').props.selectionColor).toBe(colors.primary);
  });

  it('shows the character name while the input is empty', async () => {
    await setup('');

    expect(screen.getByText('▲ Richard')).toBeTruthy();
  });

  it('shows the resend button while the input is empty', async () => {
    await setup('');

    expect(screen.getByText('↻')).toBeTruthy();
  });

  it('hides the character name once the player types', async () => {
    await setup('a');

    expect(screen.getByText('▲')).toBeTruthy();
    expect(screen.queryByText(/Richard/)).toBeNull();
  });

  it('hides the resend button once the player types', async () => {
    await setup('a');

    expect(screen.queryByText('↻')).toBeNull();
  });

  it('keeps the character name when only spaces were typed', async () => {
    await setup('   ');

    expect(screen.getByText('▲ Richard')).toBeTruthy();
  });

  it('keeps the resend button when only spaces were typed', async () => {
    await setup('   ');

    expect(screen.getByText('↻')).toBeTruthy();
  });

  it('hides the resend button while the reply is streaming', async () => {
    await setup('', true);

    expect(screen.queryByText('↻')).toBeNull();
  });
});
