import {
    AddChatVersionController,
    AddThinkVersionController,
    DeleteChatAdventureController,
    DeleteChatVersionController,
    DeleteThinkVersionController,
    ResendChatController,
    SelectChatVersionController,
} from '@adapters/controllers';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

type Handler = { handle: (request: never) => Promise<Record<string, unknown>>; };
type ControllerClass = new (logger: ILogger, useCase: never) => Handler;

const CASES = [
    { Controller: AddChatVersionController, request: { adventureId: 'adventure-1', chatId: 'chat-1', content: 'rewritten' } },
    { Controller: AddThinkVersionController, request: { adventureId: 'adventure-1', chatId: 'chat-1', content: 'rethought' } },
    { Controller: DeleteChatAdventureController, request: { adventureId: 'adventure-1', chatId: 'chat-1' } },
    { Controller: DeleteChatVersionController, request: { adventureId: 'adventure-1', chatId: 'chat-1', versionIndex: 2 } },
    { Controller: DeleteThinkVersionController, request: { adventureId: 'adventure-1', chatId: 'chat-1', versionIndex: 1 } },
    { Controller: ResendChatController, request: { adventureId: 'adventure-1', chatId: 'chat-1' } },
    { Controller: SelectChatVersionController, request: { adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' } },
] as const;

describe.each(CASES)('$Controller.name', ({ Controller, request }) => {
    function build (execute: jest.Mock): Handler {
        return new (Controller as unknown as ControllerClass)(logger, { execute } as never);
    }

    it('forwards the request and only acknowledges the command', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, adventure: { chat: [] } });

        const response = await build(execute).handle(request as never);

        expect(execute).toHaveBeenCalledWith(request);
        expect(response).toEqual({ success: true, error: undefined });
        expect(Object.keys(response).sort()).toEqual(['error', 'success']);
    });

    it('forwards the use case error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'refused' });

        const response = await build(execute).handle(request as never);

        expect(response).toEqual({ success: false, error: 'refused' });
    });
});
