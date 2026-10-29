import { DraftRepository } from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { Draft } from '@domain/entities';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function createDraft (overrides: Partial<Draft> = {}): Draft {
    return {
        id: 'home',
        content: 'Once upon a time',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        ...overrides
    };
}

function buildRepository (stored: unknown, loadSuccess = true) {
    const storage: IStorage = {
        load: jest.fn().mockResolvedValue(loadSuccess ? { success: true, data: stored } : { success: false, error: 'disk error' }),
        save: jest.fn().mockResolvedValue({ success: true })
    };
    return { repository: new DraftRepository(mockLogger, storage), storage };
}

describe('DraftRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the stored draft with the given id', async () => {
        const { repository } = buildRepository([createDraft({ id: 'other' }), createDraft()]);

        const response = await repository.getDraftById('home');

        expect(response).toEqual({ success: true, draft: createDraft() });
    });

    it('returns no draft, without failing, when none was saved yet', async () => {
        const { repository } = buildRepository(undefined);

        const response = await repository.getDraftById('home');

        expect(response).toEqual({ success: true, draft: undefined });
    });

    it('ignores stored entries that are not valid drafts', async () => {
        const { repository } = buildRepository([{ id: 'home', content: 42 }]);

        const response = await repository.getDraftById('home');

        expect(response.draft).toBeUndefined();
    });

    it('fails when the storage cannot be read', async () => {
        const { repository } = buildRepository(undefined, false);

        const response = await repository.getDraftById('home');

        expect(response).toEqual({ success: false, error: 'Failed to load drafts' });
    });

    it('replaces the draft with the same id and keeps the others', async () => {
        const other = createDraft({ id: 'other' });
        const { repository, storage } = buildRepository([other, createDraft()]);
        const updated = createDraft({ content: 'Once upon a time, a dragon' });

        const response = await repository.saveDraft({ draft: updated });

        expect(response).toEqual({ success: true });
        expect(storage.save).toHaveBeenCalledWith('@my_dungeon_app/draft', [other, updated]);
    });

    it('fails when the storage cannot be written', async () => {
        const { repository, storage } = buildRepository([]);
        (storage.save as jest.Mock).mockResolvedValue({ success: false, error: 'disk full' });

        const response = await repository.saveDraft({ draft: createDraft() });

        expect(response).toEqual({ success: false, error: 'Failed to save draft' });
    });

    it('fails when the stored drafts are not a list', async () => {
        const { repository } = buildRepository({ id: 'home' });

        const response = await repository.getDraftById('home');

        expect(response).toEqual({ success: false, error: 'Failed to load drafts' });
    });

    it('fails to save without writing when the storage cannot be read', async () => {
        const { repository, storage } = buildRepository(undefined, false);

        const response = await repository.saveDraft({ draft: createDraft() });

        expect(response).toEqual({ success: false, error: 'Failed to save draft' });
        expect(storage.save).not.toHaveBeenCalled();
    });
});
