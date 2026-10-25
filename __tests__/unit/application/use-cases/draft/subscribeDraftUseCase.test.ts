import { KeyedEventBus, StreamSessionRegistry } from '@application/streaming';
import { SubscribeDraftUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { DraftEvent, DraftStatusEnum } from '@domain/providers';
import { createBackgroundExecutionHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('SubscribeDraftUseCase', () => {
    it('subscribes to the draft events and tells whether a completion is streaming', () => {
        const bus = new KeyedEventBus<DraftEvent>(logger, event => event.draftId);
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        registry.start('home', jest.fn());
        const listener = jest.fn();

        const response = new SubscribeDraftUseCase(logger, bus, registry).execute({ draftId: 'home', listener });
        bus.publish({ draftId: 'home', status: DraftStatusEnum.STREAMING });

        expect(response.isStreaming).toBe(true);
        expect(listener).toHaveBeenCalledWith({ draftId: 'home', status: DraftStatusEnum.STREAMING });
    });

    it('requires a draft id', () => {
        const bus = new KeyedEventBus<DraftEvent>(logger, event => event.draftId);

        const response = new SubscribeDraftUseCase(logger, bus, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ draftId: '', listener: jest.fn() });

        expect(response).toEqual({ success: false, error: 'Draft id is required' });
    });
});
