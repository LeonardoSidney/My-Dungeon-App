import { AbilityRepository } from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { createAbilityHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const KEY = '@my_dungeon_app/ability';
const LOAD_FAILURE = { success: false, error: `Failed to load ${KEY}` };
const SAVE_FAILURE = { success: false, error: `Failed to save ${KEY}` };

function buildRepository (stored: unknown): { repository: AbilityRepository; storage: { load: jest.Mock; save: jest.Mock; }; } {
    const storage = {
        load: jest.fn().mockResolvedValue({ success: true, data: stored }),
        save: jest.fn().mockResolvedValue({ success: true })
    };
    return { repository: new AbilityRepository(mockLogger, storage as unknown as IStorage), storage };
}

describe('AbilityRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAbilities', () => {
        it('returns the stored abilities', async () => {
            const ability = createAbilityHelper({ id: 'a1' });
            const { repository } = buildRepository([ability]);

            const result = await repository.getAbilities();

            expect(result.success).toBe(true);
            expect(result.abilities?.map(a => a.id)).toEqual(['a1']);
        });

        it('returns an empty list when nothing is stored', async () => {
            const { repository } = buildRepository(null);

            const result = await repository.getAbilities();

            expect(result).toEqual({ success: true, abilities: [] });
        });

        it('fails when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.getAbilities();

            expect(result).toEqual({ success: false, error: 'Failed to load abilities' });
            expect(mockLogger.warning).toHaveBeenCalled();
        });

        it('fails when the stored value is not a list', async () => {
            const { repository } = buildRepository({ not: 'a list' });

            const result = await repository.getAbilities();

            expect(result).toEqual({ success: false, error: 'Failed to load abilities' });
        });

        it('skips stored entries that are not valid abilities', async () => {
            const ability = createAbilityHelper({ id: 'a1' });
            const { repository } = buildRepository([ability, { id: 'broken' }]);

            const result = await repository.getAbilities();

            expect(result.abilities?.map(a => a.id)).toEqual(['a1']);
            expect(mockLogger.warning).toHaveBeenCalledWith('Some abilities were not converted to entity');
        });
    });

    describe('getAbilityById', () => {
        it('succeeds without an ability when the id is unknown', async () => {
            const { repository } = buildRepository([createAbilityHelper({ id: 'a1' })]);

            const result = await repository.getAbilityById('missing');

            expect(result).toEqual({ success: true, ability: undefined });
        });

        it('propagates a storage failure', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.getAbilityById('a1');

            expect(result).toEqual({ success: false, error: 'Failed to load abilities' });
        });
    });

    describe('saveAbility', () => {
        it('appends the ability to the stored list', async () => {
            const existing = createAbilityHelper({ id: 'a1' });
            const ability = createAbilityHelper({ id: 'a2' });
            const { repository, storage } = buildRepository([existing]);

            const result = await repository.saveAbility({ ability });

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [existing, ability]);
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.saveAbility({ ability: createAbilityHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to save ability' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository(null);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.saveAbility({ ability: createAbilityHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to save ability' });
        });
    });

    describe('editAbility', () => {
        it('replaces the stored ability', async () => {
            const existing = createAbilityHelper({ id: 'a1', name: 'old' });
            const edited = createAbilityHelper({ id: 'a1', name: 'new' });
            const { repository, storage } = buildRepository([existing]);

            const result = await repository.editAbility({ ability: edited });

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [edited]);
        });

        it('fails when the ability does not exist', async () => {
            const { repository, storage } = buildRepository([]);

            const result = await repository.editAbility({ ability: createAbilityHelper({ id: 'a1' }) });

            expect(result).toEqual({ success: false, error: 'Ability with id a1 does not exist' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const ability = createAbilityHelper({ id: 'a1' });
            const { repository, storage } = buildRepository([ability]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.editAbility({ ability });

            expect(result).toEqual({ success: false, error: 'Failed to edit ability' });
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.editAbility({ ability: createAbilityHelper({ id: 'a1' }) });

            expect(result).toEqual({ success: false, error: 'Failed to edit ability' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when nothing is stored yet', async () => {
            const { repository } = buildRepository(null);

            const result = await repository.editAbility({ ability: createAbilityHelper({ id: 'a1' }) });

            expect(result).toEqual({ success: false, error: 'Ability with id a1 does not exist' });
        });
    });

    describe('eraseAbility', () => {
        it('removes the ability from the stored list', async () => {
            const kept = createAbilityHelper({ id: 'a1' });
            const erased = createAbilityHelper({ id: 'a2' });
            const { repository, storage } = buildRepository([kept, erased]);

            const result = await repository.eraseAbility('a2');

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [kept]);
        });

        it('fails when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.eraseAbility('a1');

            expect(result).toEqual({ success: false, error: 'Failed to erase ability' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the ability does not exist', async () => {
            const { repository, storage } = buildRepository([createAbilityHelper({ id: 'a1' })]);

            const result = await repository.eraseAbility('a2');

            expect(result).toEqual({ success: false, error: 'Ability with id a2 does not exist' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when nothing is stored yet', async () => {
            const { repository } = buildRepository(null);

            const result = await repository.eraseAbility('a1');

            expect(result).toEqual({ success: false, error: 'Ability with id a1 does not exist' });
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([createAbilityHelper({ id: 'a1' })]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.eraseAbility('a1');

            expect(result).toEqual({ success: false, error: 'Failed to erase ability' });
        });
    });
});
