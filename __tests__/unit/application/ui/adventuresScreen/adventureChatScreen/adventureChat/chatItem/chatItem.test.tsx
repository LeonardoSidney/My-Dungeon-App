import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ChatItem } from '@application/ui/adventuresScreen/adventureChatScreen/adventureChat/chatItem';
import { Chat, RoleEnum } from '@domain/entities';
import { createChatHelper } from '@test/helpers';

jest.mock('@application/ui/adventuresScreen/adventureChatScreen/adventureChat/textMarkdown', () => ({
  TextMarkdown: () => null,
}));

const onNavigateThinkIndex = jest.fn();
const onRegenerateContent = jest.fn();

const setup = (chat: Chat) =>
  render(
    <ChatItem
      chat={chat}
      isStreaming={false}
      characterNameById={{ 'character-1': 'Hero' }}
      onNavigateThinkIndex={onNavigateThinkIndex}
      onRegenerateContent={onRegenerateContent}
    />,
  );

describe('ChatItem think controls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the think navigation controls when the current think version is empty', async () => {
    const chat = createChatHelper({
      role: RoleEnum.ASSISTANT,
      think: [
        { id: 'think-1', content: 'old note', enabled: true },
        { id: 'think-2', content: '', enabled: false }
      ],
      thinkIndex: 1
    });

    await setup(chat);

    expect(screen.getByLabelText('Versão anterior do raciocínio')).toBeDefined();
    expect(screen.getByLabelText('Próxima versão do raciocínio')).toBeDefined();
  });

  it('shows the think navigation controls when the current think version is enabled', async () => {
    const chat = createChatHelper({
      role: RoleEnum.ASSISTANT,
      think: [
        { id: 'think-1', content: 'old note', enabled: true },
        { id: 'think-2', content: 'new note', enabled: true }
      ],
      thinkIndex: 1
    });

    await setup(chat);

    expect(screen.getByLabelText('Próxima versão do raciocínio')).toBeDefined();
  });

  it('hides the think controls when no think has content', async () => {
    const chat = createChatHelper({
      role: RoleEnum.ASSISTANT,
      think: [{ id: 'think-1', content: '', enabled: false }],
      thinkIndex: 0
    });

    await setup(chat);

    expect(screen.queryByLabelText('Versão anterior do raciocínio')).toBeNull();
    expect(screen.queryByLabelText('Próxima versão do raciocínio')).toBeNull();
  });

  it('shows the think controls when a think has content even when it is disabled', async () => {
    const chat = createChatHelper({
      role: RoleEnum.ASSISTANT,
      think: [{ id: 'think-1', content: 'old note', enabled: false }],
      thinkIndex: 0
    });

    await setup(chat);

    expect(screen.getByLabelText('Versão anterior do raciocínio')).toBeDefined();
    expect(screen.getByLabelText('Próxima versão do raciocínio')).toBeDefined();
  });
});

describe('ChatItem regenerate content controls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the regenerate content button on assistant chats', async () => {
    const chat = createChatHelper({ role: RoleEnum.ASSISTANT });

    await setup(chat);

    expect(screen.getByLabelText('Regenerar conteúdo')).toBeDefined();
  });

  it('hides the regenerate content button on user chats', async () => {
    const chat = createChatHelper({ role: RoleEnum.USER });

    await setup(chat);

    expect(screen.queryByLabelText('Regenerar conteúdo')).toBeNull();
  });

  it('calls onRegenerateContent with the chat id', async () => {
    const chat = createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT });

    await setup(chat);

    fireEvent.press(screen.getByLabelText('Regenerar conteúdo'));

    expect(onRegenerateContent).toHaveBeenCalledWith('assistant-1');
  });
});
