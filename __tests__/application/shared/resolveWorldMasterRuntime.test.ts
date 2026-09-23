import { resolveWorldMasterRuntime, resolveWorldMasterRuntimeFor } from '@application/shared/resolveWorldMasterRuntime';
import { createHydratedAdventureHelper } from '@test/helpers';

describe('resolveWorldMasterRuntime', () => {
    it('resolves the runtime from the dedicated world master', () => {
        const hydrated = createHydratedAdventureHelper();

        const runtime = resolveWorldMasterRuntime(hydrated);

        expect(runtime).toEqual({
            connectionId: '1',
            samplerId: '1',
            modelId: '1',
            characterId: '1'
        });
    });

    it('resolves the runtime from a character acting as world master', () => {
        const worldMasterCharacter = {
            id: '1',
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            abilityIds: [],
            proficiencyIds: [],
            statusIds: [],
            attributes: [],
            assistantId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
            abilities: [],
            proficiencies: [],
            statuses: [],
            worldMaster: true,
            aiControlled: false
        };
        const hydrated = createHydratedAdventureHelper({
            withoutWorldMaster: true,
            characters: [worldMasterCharacter]
        });

        const runtime = resolveWorldMasterRuntime(hydrated);

        expect(runtime?.characterId).toBe('1');
        expect(runtime?.modelId).toBe('1');
    });

    it('returns null when no world master is available', () => {
        const hydrated = createHydratedAdventureHelper({
            withoutWorldMaster: true,
            characters: []
        });

        const runtime = resolveWorldMasterRuntime(hydrated);

        expect(runtime).toBeNull();
    });

    it('returns null when the assistant is missing', () => {
        const hydrated = createHydratedAdventureHelper();
        hydrated.assistants = {};

        const runtime = resolveWorldMasterRuntime(hydrated);

        expect(runtime).toBeNull();
    });

    it('returns null when the connection is missing', () => {
        const hydrated = createHydratedAdventureHelper();
        hydrated.connections = [];

        const runtime = resolveWorldMasterRuntime(hydrated);

        expect(runtime).toBeNull();
    });
});

describe('resolveWorldMasterRuntimeFor', () => {
    it('returns the runtime when the adventure id matches', () => {
        const hydrated = createHydratedAdventureHelper();
        const adventureId = 'adventure-1';

        const runtime = resolveWorldMasterRuntimeFor(adventureId, hydrated);

        expect(runtime?.connectionId).toBe('1');
    });

    it('returns null when the adventure id does not match', () => {
        const hydrated = createHydratedAdventureHelper();

        const runtime = resolveWorldMasterRuntimeFor('another-adventure', hydrated);

        expect(runtime).toBeNull();
    });
});
