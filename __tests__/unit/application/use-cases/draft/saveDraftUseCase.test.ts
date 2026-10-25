import { WriteDraftService } from '@application/services';
import { StreamSessionRegistry } from '@application/streaming';
import { SaveDraftUseCase } from '@application/use-cases';
import { Draft } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { DraftStatusEnum } from '@domain/providers';
import { createBackgroundExecutionHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const storedDraft: Draft = {
    id: 'home',
    content: 'stored text',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z')
};

function createRepository (draft: Draft | null = storedDraft) {
    return {
        getDraftById: jest.fn().mockResolvedValue({ success: true, draft: draft ?? undefined }),
        saveDraft: jest.fn().mockResolvedValue({ success: true })
    };
}

describe('SaveDraftUseCase', () => {
    function build (draft: Draft | null = storedDraft) {
        const repository = createRepository(draft);
        const channel = { publish: jest.fn(), subscribe: jest.fn() };
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        const useCase = new SaveDraftUseCase(logger, repository, new WriteDraftService(logger), channel, registry);
        return { useCase, repository, channel, registry };
    }

    it('saves the edited content and notifies the subscribers', async () => {
        const { useCase, repository, channel } = build();

        const response = await useCase.execute({ draftId: 'home', content: 'edited text' });

        expect(response).toEqual({ success: true });
        expect(repository.saveDraft).toHaveBeenCalledWith({
            draft: expect.objectContaining({ id: 'home', content: 'edited text', createdAt: storedDraft.createdAt })
        });
        expect(channel.publish).toHaveBeenCalledWith({ draftId: 'home', status: DraftStatusEnum.IDLE });
    });

    it('keeps an existing draft when asked to save only if missing', async () => {
        const { useCase, repository, channel } = build();

        const response = await useCase.execute({ draftId: 'home', content: 'seed text', onlyIfMissing: true });

        expect(response).toEqual({ success: true });
        expect(repository.saveDraft).not.toHaveBeenCalled();
        expect(channel.publish).not.toHaveBeenCalled();
    });

    it('creates the draft when asked to save only if missing and none exists', async () => {
        const { useCase, repository } = build(null);

        await useCase.execute({ draftId: 'home', content: 'seed text', onlyIfMissing: true });

        expect(repository.saveDraft).toHaveBeenCalledWith({ draft: expect.objectContaining({ content: 'seed text' }) });
    });

    it('skips the edit while a completion owns the draft', async () => {
        const { useCase, repository, channel, registry } = build();
        registry.start('home', jest.fn());

        const response = await useCase.execute({ draftId: 'home', content: 'edited text' });

        expect(response).toEqual({ success: true });
        expect(repository.saveDraft).not.toHaveBeenCalled();
        expect(channel.publish).not.toHaveBeenCalled();
    });

    it('skips the edit when a completion starts while the draft is being loaded', async () => {
        const { useCase, repository, channel, registry } = build();
        repository.getDraftById.mockImplementation(async () => {
            registry.start('home', jest.fn());
            return { success: true, draft: storedDraft };
        });

        const response = await useCase.execute({ draftId: 'home', content: 'edited text' });

        expect(response).toEqual({ success: true });
        expect(repository.saveDraft).not.toHaveBeenCalled();
        expect(channel.publish).not.toHaveBeenCalled();
    });

    it('accepts an empty draft', async () => {
        const { useCase, repository } = build();

        const response = await useCase.execute({ draftId: 'home', content: '' });

        expect(response).toEqual({ success: true });
        expect(repository.saveDraft).toHaveBeenCalledWith({ draft: expect.objectContaining({ content: '' }) });
    });

    it('propagates a save failure without notifying', async () => {
        const { useCase, repository, channel } = build();
        repository.saveDraft.mockResolvedValue({ success: false, error: 'Failed to save draft' });

        const response = await useCase.execute({ draftId: 'home', content: 'edited text' });

        expect(response).toEqual({ success: false, error: 'Failed to save draft' });
        expect(channel.publish).not.toHaveBeenCalled();
    });

    it.each([
        [{ draftId: ' ', content: 'text' }, 'Draft id is required'],
        [{ draftId: 'home', content: undefined as unknown as string }, 'Draft content is required']
    ])('validates %p before reading the draft', async (params, error) => {
        const { useCase, repository } = build();

        const response = await useCase.execute(params);

        expect(response).toEqual({ success: false, error });
        expect(repository.getDraftById).not.toHaveBeenCalled();
    });

    it('propagates a failure to load the draft without saving', async () => {
        const { useCase, repository } = build();
        repository.getDraftById.mockResolvedValue({ success: false, error: 'Failed to load drafts' });

        const response = await useCase.execute({ draftId: 'home', content: 'edited text' });

        expect(response).toEqual({ success: false, error: 'Failed to load drafts' });
        expect(repository.saveDraft).not.toHaveBeenCalled();
    });
});
