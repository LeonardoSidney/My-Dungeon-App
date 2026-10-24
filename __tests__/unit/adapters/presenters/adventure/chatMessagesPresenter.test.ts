import { ChatMessagesPresenter } from '@adapters/presenters';
import { Chat } from '@domain/entities';
import { RoleEnum } from '@domain/entities';
import { createChatHelper } from '@test/helpers';

const presenter = new ChatMessagesPresenter();

function toChatMessageView (chat: Chat) {
    return presenter.presentOne(chat);
}

describe('ChatMessagesPresenter', () => {
    it('exposes only the selected content version and the version counters', () => {
        const view = toChatMessageView(createChatHelper({
            id: 'chat-1',
            role: RoleEnum.ASSISTANT,
            characterId: 'wm-1',
            content: ['v1', 'v2', 'v3'],
            index: 1
        }));

        expect(view).toEqual({
            id: 'chat-1',
            role: RoleEnum.ASSISTANT,
            characterId: 'wm-1',
            content: 'v2',
            contentIndex: 1,
            contentCount: 3,
            think: undefined,
            isStreaming: false
        });
    });

    it('clamps an out of range index to the last version', () => {
        const view = toChatMessageView(createChatHelper({ content: ['only'], index: 4 }));

        expect(view.content).toBe('only');
        expect(view.contentIndex).toBe(0);
    });

    it('exposes the selected think version when any version has content', () => {
        const view = toChatMessageView(createChatHelper({
            think: [
                { id: 't0', content: 'old note', enabled: true },
                { id: 't1', content: '', enabled: false }
            ],
            thinkIndex: 1
        }));

        expect(view.think).toEqual({ content: '', index: 1, count: 2 });
    });

    it('omits the think when no version has content', () => {
        const view = toChatMessageView(createChatHelper({ think: [{ id: 't0', content: '', enabled: false }] }));

        expect(view.think).toBeUndefined();
    });

    it('presents every chat of a list in order', () => {
        const chats = [createChatHelper({ id: 'chat-1' }), createChatHelper({ id: 'chat-2' })];

        expect(presenter.present(chats)).toEqual(chats.map(chat => presenter.presentOne(chat)));
    });

    it('presents an empty content when the chat has no content versions', () => {
        const view = toChatMessageView(createChatHelper({ content: [], index: 0 }));

        expect(view.content).toBe('');
        expect(view.contentCount).toBe(0);
    });
});
