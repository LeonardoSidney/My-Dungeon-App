import { KeyedEventBus } from '@application/streaming';
import { ChatReplyEvent, ChatReplyStatusEnum } from '@domain/providers';
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

const event: ChatReplyEvent = { adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.STREAMING };

describe('KeyedEventBus', () => {
    it('notifies only the listeners of the event key', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, entry => entry.adventureId);
        const sameAdventure = jest.fn();
        const otherAdventure = jest.fn();
        bus.subscribe('adventure-1', sameAdventure);
        bus.subscribe('adventure-2', otherAdventure);

        bus.publish(event);

        expect(sameAdventure).toHaveBeenCalledWith(event);
        expect(otherAdventure).not.toHaveBeenCalled();
    });

    it('stops notifying a listener after it unsubscribes', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, entry => entry.adventureId);
        const listener = jest.fn();
        const unsubscribe = bus.subscribe('adventure-1', listener);

        unsubscribe();
        bus.publish(event);

        expect(listener).not.toHaveBeenCalled();
    });

    it('keeps notifying the other listeners when one throws', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, entry => entry.adventureId);
        const healthy = jest.fn();
        bus.subscribe('adventure-1', () => { throw new Error('broken listener'); });
        bus.subscribe('adventure-1', healthy);

        bus.publish(event);

        expect(healthy).toHaveBeenCalledWith(event);
        expect(logger.error).toHaveBeenCalled();
    });

    it('does not drop listeners registered after a stale unsubscribe is called again', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, entry => entry.adventureId);
        const staleUnsubscribe = bus.subscribe('adventure-1', jest.fn());
        staleUnsubscribe();
        const listener = jest.fn();
        bus.subscribe('adventure-1', listener);

        staleUnsubscribe();
        bus.publish(event);

        expect(listener).toHaveBeenCalledWith(event);
    });
});
