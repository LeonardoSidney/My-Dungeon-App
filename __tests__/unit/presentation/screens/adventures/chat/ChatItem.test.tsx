import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ChatItem } from '@presentation/screens/adventures/chat/components/ChatItem';
import type { ChatMessageActions } from '@presentation/screens/adventures/chat/types';
import { Chat, RoleEnum } from '@domain/entities';
import { createChatHelper } from '@test/helpers';
import { ChatMessagesPresenter } from '@adapters/presenters';

jest.mock('@presentation/screens/adventures/chat/components/textMarkdown', () => ({
  TextMarkdown: () => null,
}));

const actions: ChatMessageActions = {
  deleteMessage: jest.fn(),
  startEdit: jest.fn(),
  saveEdit: jest.fn(),
  discardEdit: jest.fn(),
  continueFrom: jest.fn(),
  regenerateFrom: jest.fn(),
  regenerateContent: jest.fn(),
  navigateContent: jest.fn(),
  navigateThink: jest.fn(),
  regenerateFromThink: jest.fn(),
  startThinkEdit: jest.fn(),
  saveThinkEdit: jest.fn(),
  discardThinkEdit: jest.fn(),
  deleteThink: jest.fn(),
};

const setup = (chat: Chat) =>
  render(
    <ChatItem
      message={new ChatMessagesPresenter().presentOne(chat)}
      characterName="Hero"
      editingChatId={null}
      editingThinkChatId={null}
      actions={actions}
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

    expect(actions.regenerateContent).toHaveBeenCalledWith('assistant-1');
  });
});
