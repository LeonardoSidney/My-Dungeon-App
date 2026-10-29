import { GetDraftByIdUseCase } from '@application/use-cases';
import { Draft } from '@domain/entities';
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

describe('GetDraftByIdUseCase', () => {
    it('returns the stored draft', async () => {
        const repository = createRepository();

        const response = await new GetDraftByIdUseCase(logger, repository).execute({ draftId: 'home' });

        expect(repository.getDraftById).toHaveBeenCalledWith('home');
        expect(response).toEqual({ success: true, draft: storedDraft });
    });

    it('propagates a repository failure', async () => {
        const repository = createRepository();
        repository.getDraftById.mockResolvedValue({ success: false, error: 'Failed to load drafts' });

        const response = await new GetDraftByIdUseCase(logger, repository).execute({ draftId: 'home' });

        expect(response).toEqual({ success: false, error: 'Failed to load drafts' });
    });

    it('requires a draft id', async () => {
        const repository = createRepository();

        const response = await new GetDraftByIdUseCase(logger, repository).execute({ draftId: '' });

        expect(response).toEqual({ success: false, error: 'Draft id is required' });
        expect(repository.getDraftById).not.toHaveBeenCalled();
    });
});
