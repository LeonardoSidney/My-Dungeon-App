import {
    GetDraftController,
    SaveDraftController,
    StartDraftCompletionController,
    StopDraftCompletionController,
    SubscribeDraftController,
} from '@adapters/controllers';
import { DraftPresenter } from '@adapters/presenters';
import { ILogger } from '@domain/logger';
import { DraftEvent, DraftStatusEnum, KeyedEventListener } from '@domain/providers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GetDraftController', () => {
    it('presents only the id and the content of the draft', async () => {
        const draft = { id: 'home', content: 'text', createdAt: new Date(), updatedAt: new Date() };
        const execute = jest.fn().mockResolvedValue({ success: true, draft });

        const response = await new GetDraftController(logger, { execute }, new DraftPresenter()).handle({ draftId: 'home' });

        expect(execute).toHaveBeenCalledWith({ draftId: 'home' });
        expect(response).toEqual({ success: true, draft: { id: 'home', content: 'text' }, error: undefined });
    });

    it('answers without a draft when none was saved yet', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await new GetDraftController(logger, { execute }, new DraftPresenter()).handle({ draftId: 'home' });

        expect(response).toEqual({ success: true, draft: undefined, error: undefined });
    });
});

describe('draft command controllers', () => {
    it('forwards the save request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await new SaveDraftController(logger, { execute }).handle({ draftId: 'home', content: 'text', onlyIfMissing: true });

        expect(execute).toHaveBeenCalledWith({ draftId: 'home', content: 'text', onlyIfMissing: true });
        expect(response).toEqual({ success: true });
    });

    it('forwards the start request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'No loaded model found on any connection' });

        const response = await new StartDraftCompletionController(logger, { execute }).handle({ draftId: 'home', prompt: 'Once' });

        expect(execute).toHaveBeenCalledWith({ draftId: 'home', prompt: 'Once' });
        expect(response).toEqual({ success: false, error: 'No loaded model found on any connection' });
    });

    it('forwards the stop request', () => {
        const execute = jest.fn().mockReturnValue({ success: true });

        const response = new StopDraftCompletionController(logger, { execute }).handle({ draftId: 'home' });

        expect(execute).toHaveBeenCalledWith({ draftId: 'home' });
        expect(response).toEqual({ success: true });
    });
});

describe('SubscribeDraftController', () => {
    function subscribe () {
        let listener: KeyedEventListener<DraftEvent> = () => undefined;
        const unsubscribe = jest.fn();
        const execute = jest.fn((params: { listener: KeyedEventListener<DraftEvent>; }) => {
            listener = params.listener;
            return { success: true, isStreaming: false, unsubscribe };
        });
        const onUpdate = jest.fn();

        const response = new SubscribeDraftController(logger, { execute }).handle({ draftId: 'home', onUpdate });

        return { response, onUpdate, unsubscribe, emit: (event: DraftEvent) => listener(event) };
    }

    it('returns the subscription state from the use case', () => {
        const { response, unsubscribe } = subscribe();

        expect(response).toEqual({ success: true, isStreaming: false, unsubscribe, error: undefined });
    });

    it.each([
        [DraftStatusEnum.STREAMING, true],
        [DraftStatusEnum.IDLE, false],
    ])('maps a %s event into an update view', (status, isStreaming) => {
        const { onUpdate, emit } = subscribe();

        emit({ draftId: 'home', status, error: 'oops' });

        expect(onUpdate).toHaveBeenCalledWith({ isStreaming, error: 'oops' });
    });
});
