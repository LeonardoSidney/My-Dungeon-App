import { StreamSessionRegistry } from '@application/streaming';
import { StopDraftCompletionUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createBackgroundExecutionHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('StopDraftCompletionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('aborts the streaming completion of the draft', () => {
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        const abort = jest.fn();
        registry.start('home', abort);

        const response = new StopDraftCompletionUseCase(logger, registry).execute({ draftId: 'home' });

        expect(response).toEqual({ success: true });
        expect(abort).toHaveBeenCalled();
    });

    it('requires a draft id', () => {
        const response = new StopDraftCompletionUseCase(logger, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ draftId: '' });

        expect(response).toEqual({ success: false, error: 'Draft id is required' });
    });

    it('succeeds and warns when no completion is streaming into the draft', () => {
        const response = new StopDraftCompletionUseCase(logger, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ draftId: 'home' });

        expect(response).toEqual({ success: true });
        expect(logger.warning).toHaveBeenCalled();
    });
});
