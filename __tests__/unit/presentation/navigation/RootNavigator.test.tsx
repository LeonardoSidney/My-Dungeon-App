import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ControllersProvider } from '@presentation/providers/ControllersProvider';
import { RootNavigator } from '@presentation/navigation/RootNavigator';
import type { AppControllers } from '@presentation/providers/appControllers';
import { RoleEnum } from '@domain/entities';

jest.mock('lucide-react-native', () => new Proxy({}, { get: () => () => null }));
jest.mock('@presentation/screens/adventures/chat/components/textMarkdown', () => {
  const { Text } = require('react-native');
  return { TextMarkdown: ({ content }: { content: string; }) => <Text>{content}</Text> };
});

const message = (id: string, role: RoleEnum, content: string) => ({
  id, role, characterId: role === RoleEnum.USER ? 'c1' : 'wm1', content, contentIndex: 0, contentCount: 1, isStreaming: false,
});

const responses: Record<string, unknown> = {
  getAdventures: { success: true, items: [{ id: 'a1', name: 'Lost Kingdom', createdAt: '2026-01-01' }] },
  getAdventureSummary: { success: true, data: { name: 'Lost Kingdom' } },
  getAdventure: {
    success: true,
    data: {
      id: 'a1', name: 'Lost Kingdom', systemPromptIds: [], playableCharacterIds: [], aiControlledCharacterIds: [],
      worldIds: [], locationIds: [], itemIds: [],
    },
  },
  getAdventureCharacters: { success: true, items: [{ id: 'c1', name: 'Hero' }] },
  getAdventureWorldMaster: { success: true, data: { id: 'wm1', name: 'Narrator' } },
  getChatMessages: { success: true, messages: [message('m1', RoleEnum.USER, 'I open the door'), message('m2', RoleEnum.ASSISTANT, 'It creaks')] },
  getAdventureSystemPrompt: { success: true, data: 'SYSTEM PROMPT TEXT' },
  getAbilities: { success: true, items: [{ id: 'ab1', name: 'Fireball', activationWord: 'fire' }] },
  getSamplers: { success: true, items: [{ id: 's1', name: 'Default', systemDefault: true }] },
  getDraft: { success: true, draft: { id: 'home', content: 'draft text' } },
  appendChatAdventure: { success: true },
  generateChatReply: { success: true },
};

const syncResponses: Record<string, unknown> = {
  subscribeChatReply: { success: true, isReplying: false, unsubscribe: () => undefined },
  subscribeDraft: { success: true, isStreaming: false, unsubscribe: () => undefined },
  stopChatReply: { success: true },
  stopDraftCompletion: { success: true },
};

const calls: Record<string, unknown[]> = {};
const cache: Record<string, unknown> = {};
const controllers = new Proxy({}, {
  get: (_target, key: string) => (cache[key] ??= {
    handle: (params: unknown) => {
      (calls[key] ??= []).push(params);
      if (key in syncResponses) return syncResponses[key];
      return Promise.resolve(responses[key] ?? { success: true, items: [] });
    },
  }),
}) as AppControllers;

describe('RootNavigator', () => {
  it('renders every menu screen and walks the adventure list → prompt → chat → settings flow', async () => {
    await render(
      <ControllersProvider controllers={controllers}>
        <RootNavigator />
      </ControllersProvider>,
    );

    await waitFor(() => expect(screen.getByDisplayValue('draft text')).toBeDefined());

    for (const label of ['Characters', 'Abilities', 'Statuses', 'Items', 'Locations', 'System Prompts', 'Proficiencies', 'Assistants', 'Samplers', 'World Masters', 'Worlds', 'Settings']) {
      await fireEvent.press(screen.getAllByText(label)[0]);
      await waitFor(() => expect(screen.getAllByText(label).length).toBeGreaterThan(1));
    }

    await fireEvent.press(screen.getByText('Abilities'));
    await waitFor(() => expect(screen.getByText('Fireball')).toBeDefined());
    await fireEvent.press(screen.getByText('Add Ability'));
    await waitFor(() => expect(screen.getAllByText('Add Ability')).toHaveLength(2));
    await fireEvent.press(screen.getByText('Create'));
    await waitFor(() => expect(screen.getByText('Name is required')).toBeDefined());

    await fireEvent.press(screen.getByText('Samplers'));
    await waitFor(() => expect(screen.getByText('Default')).toBeDefined());
    await fireEvent.press(screen.getByText('Add Sampler'));
    await waitFor(() => expect(screen.getByText('Generation Settings')).toBeDefined());

    await fireEvent.press(screen.getByText('Adventures'));
    await waitFor(() => expect(screen.getByText('Lost Kingdom')).toBeDefined());
    await fireEvent.press(screen.getByText('Add Adventure'));
    await waitFor(() => expect(screen.getByText('New Adventure')).toBeDefined());
    await fireEvent.press(screen.getByText('Cancel'));

    await fireEvent.press(screen.getByLabelText('View prompt'));
    await waitFor(() => expect(screen.getByText('SYSTEM PROMPT TEXT')).toBeDefined());
    await fireEvent.press(screen.getByLabelText('Back'));

    await waitFor(() => expect(screen.getByLabelText('Open chat')).toBeDefined());
    await fireEvent.press(screen.getByLabelText('Open chat'));
    await waitFor(() => expect(screen.getByText('It creaks')).toBeDefined());
    expect(screen.getByText('Hero')).toBeDefined();
    expect(screen.getByText('Narrator')).toBeDefined();

    await fireEvent.changeText(screen.getByPlaceholderText('Type a message...'), 'Hello');
    await fireEvent.press(screen.getByText('Send'));
    await waitFor(() => expect(calls.appendChatAdventure).toEqual([{ adventureId: 'a1', characterId: 'c1', content: 'Hello' }]));
    await waitFor(() => expect(calls.generateChatReply).toEqual([{ adventureId: 'a1', chatId: undefined }]));

    await fireEvent.press(screen.getByText('settings'));
    await waitFor(() => expect(screen.getByText('Lost Kingdom · Settings')).toBeDefined());
    await fireEvent.press(screen.getByText('General'));
    await fireEvent.changeText(screen.getByDisplayValue('Lost Kingdom'), 'Found Kingdom');
    await waitFor(() => expect(screen.getByText('Discard')).toBeDefined());
    await fireEvent.press(screen.getByText('Discard'));
    await waitFor(() => expect(screen.queryByText('Discard')).toBeNull());
    await fireEvent.press(screen.getByLabelText('Back'));
    await waitFor(() => expect(screen.getByText('It creaks')).toBeDefined());

    await fireEvent.press(screen.getByLabelText('Back'));
    await waitFor(() => expect(screen.getByLabelText('Open chat')).toBeDefined());
  }, 60000);
});
