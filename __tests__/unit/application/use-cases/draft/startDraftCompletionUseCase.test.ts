import { WriteDraftService } from '@application/services';
import { StreamSessionRegistry } from '@application/streaming';
import { StartDraftCompletionUseCase } from '@application/use-cases';
import { Draft } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { DraftEvent, DraftStatusEnum } from '@domain/providers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const NO_INTERMEDIATE_UPDATES = 60_000;

function asyncTokens (tokens: string[]) {
    return (async function* () {
        for (const token of tokens) {
            yield token;
        }
    })();
}

function failingTokens (tokens: string[], error: Error) {
    return (async function* () {
        for (const token of tokens) {
            yield token;
        }
        throw error;
    })();
}

function controllableTokens () {
    const pending: Array<(result: IteratorResult<string>) => void> = [];
    const queued: Array<IteratorResult<string>> = [];
    const settle = (result: IteratorResult<string>) => {
        const resolve = pending.shift();
        if (resolve) {
            resolve(result);
            return;
        }
        queued.push(result);
    };

    return {
        push: (token: string) => settle({ value: token, done: false }),
        end: () => settle({ value: undefined, done: true }),
        stream: {
            [Symbol.asyncIterator]: () => ({
                next: () => new Promise<IteratorResult<string>>(resolve => {
                    const result = queued.shift();
                    if (result) {
                        resolve(result);
                        return;
                    }
                    pending.push(resolve);
                })
            })
        }
    };
}

function buildMocks (tokens: AsyncIterable<string> = asyncTokens([' and', ' then']), existing?: Draft) {
    const events: DraftEvent[] = [];
    let settle: () => void = () => undefined;
    const settled = new Promise<void>(resolve => { settle = resolve; });
    const abortStream = jest.fn();

    return {
        events,
        settled,
        abortStream,
        registry: new StreamSessionRegistry(),
        repository: {
            getDraftById: jest.fn().mockResolvedValue({ success: true, draft: existing }),
            saveDraft: jest.fn().mockResolvedValue({ success: true })
        },
        streamPrompt: {
            execute: jest.fn().mockResolvedValue({ success: true, stream: tokens, abort: abortStream })
        },
        channel: {
            publish: jest.fn((event: DraftEvent) => {
                events.push(event);
                if (event.status === DraftStatusEnum.IDLE) settle();
            }),
            subscribe: jest.fn()
        }
    };
}

function buildUseCase (mocks: ReturnType<typeof buildMocks>, throttleMs = NO_INTERMEDIATE_UPDATES) {
    return new StartDraftCompletionUseCase(
        logger,
        mocks.repository,
        new WriteDraftService(logger),
        mocks.streamPrompt,
        mocks.channel,
        mocks.registry,
        throttleMs
    );
}

function savedContents (mocks: ReturnType<typeof buildMocks>): string[] {
    return mocks.repository.saveDraft.mock.calls.map(([params]) => params.draft.content);
}

describe('StartDraftCompletionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns right away and saves the completion into the draft in the background', async () => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(response).toEqual({ success: true });
        expect(mocks.streamPrompt.execute).toHaveBeenCalledWith({ prompt: 'Once' });
        expect(savedContents(mocks)).toEqual(['Once', 'Once and then']);
        expect(mocks.events).toEqual([
            { draftId: 'home', status: DraftStatusEnum.STREAMING, error: undefined },
            { draftId: 'home', status: DraftStatusEnum.IDLE, error: undefined }
        ]);
        expect(mocks.registry.isActive('home')).toBe(false);
    });

    it('saves and notifies after each throttled chunk', async () => {
        const mocks = buildMocks(asyncTokens(['a', 'b']));

        await buildUseCase(mocks, 0).execute({ draftId: 'home', prompt: 'x' });
        await mocks.settled;

        expect(savedContents(mocks)).toEqual(['x', 'xa', 'xab', 'xab']);
        expect(mocks.events.map(event => event.status)).toEqual([
            DraftStatusEnum.STREAMING,
            DraftStatusEnum.STREAMING,
            DraftStatusEnum.STREAMING,
            DraftStatusEnum.IDLE
        ]);
    });

    it('keeps the creation date of the existing draft', async () => {
        const createdAt = new Date('2026-01-01T00:00:00.000Z');
        const mocks = buildMocks(undefined, { id: 'home', content: 'old', createdAt, updatedAt: createdAt });

        await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(mocks.repository.saveDraft).toHaveBeenLastCalledWith({ draft: expect.objectContaining({ createdAt }) });
    });

    it('keeps what was generated and reports the error when the model stream breaks', async () => {
        const mocks = buildMocks(failingTokens([' partial'], new Error('Request failed with status 500')));

        await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(savedContents(mocks)).toEqual(['Once', 'Once partial']);
        expect(mocks.events[mocks.events.length - 1]).toEqual({ draftId: 'home', status: DraftStatusEnum.IDLE, error: 'Request failed with status 500' });
    });

    it('reports an error when the final save fails', async () => {
        const mocks = buildMocks();
        mocks.repository.saveDraft
            .mockResolvedValueOnce({ success: true })
            .mockResolvedValueOnce({ success: false, error: 'Failed to save draft' });

        await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to save draft');
        expect(mocks.registry.isActive('home')).toBe(false);
    });

    it('releases the draft and reports a failure when a save throws unexpectedly', async () => {
        const mocks = buildMocks();
        mocks.repository.saveDraft
            .mockResolvedValueOnce({ success: true })
            .mockRejectedValueOnce(new Error('boom'));

        await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual({ draftId: 'home', status: DraftStatusEnum.IDLE, error: 'Failed to stream response' });
        expect(mocks.registry.isActive('home')).toBe(false);
    });

    it('stops reading tokens when the registry stops the completion', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks(tokens.stream);

        await buildUseCase(mocks, 0).execute({ draftId: 'home', prompt: 'Once' });
        tokens.push(' upon');
        await new Promise<void>(resolve => setImmediate(() => resolve()));
        mocks.registry.stop('home');
        tokens.push(' ignored');
        await mocks.settled;

        expect(mocks.abortStream).toHaveBeenCalled();
        expect(savedContents(mocks)[savedContents(mocks).length - 1]).toBe('Once upon');
    });

    it('rejects a second completion while one is streaming into the draft', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks(tokens.stream);
        const useCase = buildUseCase(mocks);

        await useCase.execute({ draftId: 'home', prompt: 'Once' });
        const second = await useCase.execute({ draftId: 'home', prompt: 'Once' });

        expect(second).toEqual({ success: false, error: 'A completion is already streaming for this draft' });
        expect(mocks.streamPrompt.execute).toHaveBeenCalledTimes(1);

        tokens.end();
        await mocks.settled;
    });

    it('fails without saving when the model stream cannot start', async () => {
        const mocks = buildMocks();
        mocks.streamPrompt.execute.mockResolvedValue({ success: false, error: 'No loaded model found on any connection' });

        const response = await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });

        expect(response).toEqual({ success: false, error: 'No loaded model found on any connection' });
        expect(mocks.repository.saveDraft).not.toHaveBeenCalled();
        expect(mocks.registry.isActive('home')).toBe(false);
    });

    it('fails before streaming when the draft cannot be loaded', async () => {
        const mocks = buildMocks();
        mocks.repository.getDraftById.mockResolvedValue({ success: false, error: 'Failed to load drafts' });

        const response = await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });

        expect(response).toEqual({ success: false, error: 'Failed to load drafts' });
        expect(mocks.streamPrompt.execute).not.toHaveBeenCalled();
    });

    it('aborts the model stream and releases the draft when the prompt cannot be saved', async () => {
        const mocks = buildMocks();
        mocks.repository.saveDraft.mockResolvedValue({ success: false, error: 'Failed to save draft' });

        const response = await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });

        expect(response).toEqual({ success: false, error: 'Failed to save draft' });
        expect(mocks.abortStream).toHaveBeenCalled();
        expect(mocks.registry.isActive('home')).toBe(false);
        expect(mocks.channel.publish).not.toHaveBeenCalled();
    });

    it.each([
        [{ draftId: '', prompt: 'Once' }, 'Draft id is required'],
        [{ draftId: 'home', prompt: '  ' }, 'Prompt is required'],
    ])('validates %p before doing anything', async (params, error) => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute(params);

        expect(response).toEqual({ success: false, error });
        expect(mocks.repository.getDraftById).not.toHaveBeenCalled();
    });

    it('throttles intermediate saves by default', async () => {
        const mocks = buildMocks();
        const useCase = new StartDraftCompletionUseCase(
            logger,
            mocks.repository,
            new WriteDraftService(logger),
            mocks.streamPrompt,
            mocks.channel,
            mocks.registry
        );

        await useCase.execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(savedContents(mocks)).toEqual(['Once', 'Once and then']);
    });

    it('falls back to a generic error when the model stream cannot start without a message', async () => {
        const mocks = buildMocks();
        mocks.streamPrompt.execute.mockResolvedValue({ success: false });

        const response = await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });

        expect(response).toEqual({ success: false, error: 'Failed to start stream completion' });
    });

    it('aborts the model stream when another completion claims the draft first', async () => {
        const mocks = buildMocks();
        const registry = { isActive: jest.fn().mockReturnValue(false), start: jest.fn().mockReturnValue(false), release: jest.fn(), stop: jest.fn() };
        const useCase = new StartDraftCompletionUseCase(
            logger,
            mocks.repository,
            new WriteDraftService(logger),
            mocks.streamPrompt,
            mocks.channel,
            registry as never,
            NO_INTERMEDIATE_UPDATES
        );

        const response = await useCase.execute({ draftId: 'home', prompt: 'Once' });

        expect(response).toEqual({ success: false, error: 'A completion is already streaming for this draft' });
        expect(mocks.abortStream).toHaveBeenCalled();
        expect(mocks.repository.saveDraft).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when the prompt cannot be saved without a message', async () => {
        const mocks = buildMocks();
        mocks.repository.saveDraft.mockResolvedValue({ success: false });

        const response = await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });

        expect(response).toEqual({ success: false, error: 'Failed to save draft' });
    });

    it('keeps streaming without notifying when an intermediate save fails', async () => {
        const mocks = buildMocks(asyncTokens(['a']));
        mocks.repository.saveDraft
            .mockResolvedValueOnce({ success: true })
            .mockResolvedValueOnce({ success: false, error: 'disk busy' })
            .mockResolvedValueOnce({ success: true });

        await buildUseCase(mocks, 0).execute({ draftId: 'home', prompt: 'x' });
        await mocks.settled;

        expect(savedContents(mocks)).toEqual(['x', 'xa', 'xa']);
        expect(mocks.events.map(event => event.status)).toEqual([DraftStatusEnum.STREAMING, DraftStatusEnum.IDLE]);
    });

    it('reports a generic interruption when the model stream throws a non Error value', async () => {
        const tokens = (async function* () {
            yield ' partial';
            throw 'connection reset';
        })();
        const mocks = buildMocks(tokens);

        await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to stream response');
    });

    it('falls back to a generic error when the final save fails without a message', async () => {
        const mocks = buildMocks();
        mocks.repository.saveDraft
            .mockResolvedValueOnce({ success: true })
            .mockResolvedValueOnce({ success: false });

        await buildUseCase(mocks).execute({ draftId: 'home', prompt: 'Once' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to save draft');
    });
});
