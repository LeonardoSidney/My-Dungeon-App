import { handleNavVersionIndex } from '@application/ui/adventuresScreen/adventureChatScreen/handleNavVersionIndex';

describe('handleNavVersionIndex', () => {
    it.each(['content', 'think'] as const)('sends only the direction for %s versions and re-reads the messages', async (kind) => {
        const selectChatVersion = { handle: jest.fn().mockResolvedValue({ success: true }) };
        const reloadMessages = jest.fn().mockResolvedValue(undefined);

        await handleNavVersionIndex({ adventureId: 'adventure-1', kind, reloadMessages, selectChatVersion })('chat-1', 1);

        expect(selectChatVersion.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind });
        expect(reloadMessages).toHaveBeenCalled();
    });

    it('does not re-read the messages when the backend rejects the selection', async () => {
        const selectChatVersion = { handle: jest.fn().mockResolvedValue({ success: false, error: 'not found' }) };
        const reloadMessages = jest.fn();

        await handleNavVersionIndex({ adventureId: 'adventure-1', kind: 'content', reloadMessages, selectChatVersion })('chat-1', -1);

        expect(reloadMessages).not.toHaveBeenCalled();
    });
});
