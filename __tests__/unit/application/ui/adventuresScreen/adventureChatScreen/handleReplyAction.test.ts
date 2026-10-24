import { handleReplyAction } from '@application/ui/adventuresScreen/adventureChatScreen/handleReplyAction';

describe('handleReplyAction', () => {
    it('streams the reply into the chat id the backend answered with', async () => {
        const streamReply = jest.fn().mockResolvedValue(undefined);
        const alert = { handle: jest.fn() };

        await handleReplyAction({
            prepare: jest.fn().mockResolvedValue({ success: true, replyChatId: 'assistant-1' }),
            fallbackError: 'Failed',
            streamReply,
            alert,
        });

        expect(streamReply).toHaveBeenCalledWith('assistant-1');
        expect(alert.handle).not.toHaveBeenCalled();
    });

    it('alerts and does not stream when the command fails', async () => {
        const streamReply = jest.fn();
        const alert = { handle: jest.fn() };

        await handleReplyAction({
            prepare: jest.fn().mockResolvedValue({ success: false, error: 'No user message' }),
            fallbackError: 'Failed',
            streamReply,
            alert,
        });

        expect(alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'No user message' });
        expect(streamReply).not.toHaveBeenCalled();
    });
});
