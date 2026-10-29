import * as container from '@infra/container';
import { seedCharacters } from '@src/migrations/seedCharacters';

jest.mock('@infra/container', () => {
    const controllers: Record<string, { handle: jest.Mock; }> = {};
    return new Proxy({}, {
        get: (_, name: string) => (name === '__esModule' ? true : () => (controllers[name] ??= { handle: jest.fn() }))
    });
});

jest.mock('@infra/container/shared', () => ({
    logger: { debug: jest.fn(), storage: jest.fn(), streaming: jest.fn(), info: jest.fn(), warning: jest.fn(), error: jest.fn(), log: jest.fn() }
}));

function controller (factory: keyof typeof container): { handle: jest.Mock; } {
    return (container[factory] as unknown as () => { handle: jest.Mock; })();
}

const ASSISTANTS = [{ id: 'assistant-1', name: 'Narrator' }];
const ABILITIES = [{ id: 'ability-1', name: 'Fireball' }];
const PROFICIENCIES = [{ id: 'proficiency-1', name: 'Swords' }];
const STATUSES = [{ id: 'status-1', name: 'Healthy' }];

const seed = (name: string) => ({
    name,
    activationWord: 'activate',
    prompt: `${name} prompt`,
    observation: `${name} observation`,
    assistant: 'Narrator',
    abilities: ['Fireball'],
    proficiencies: ['Swords'],
    statuses: ['Healthy'],
    attributes: [{ name: 'Strength', value: 10 }]
});

const RESOLVED = {
    activationWord: 'activate',
    assistantId: 'assistant-1',
    abilityIds: ['ability-1'],
    proficiencyIds: ['proficiency-1'],
    statusIds: ['status-1'],
    attributes: [{ name: 'Strength', value: 10 }]
};

function setup () {
    const controllers = {
        create: controller('createCharacterController'),
        edit: controller('editCharacterController'),
        list: controller('getCharactersController')
    };
    controllers.list.handle.mockResolvedValue({ success: true, items: [{ id: 'c1', name: 'Existing' }] });
    controllers.create.handle.mockResolvedValue({ success: true });
    controllers.edit.handle.mockResolvedValue({ success: true });
    return controllers;
}

function run (seeds: ReturnType<typeof seed>[]) {
    return seedCharacters(seeds, ASSISTANTS, ABILITIES, PROFICIENCIES, STATUSES);
}

describe('seedCharacters', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('creates the missing characters and restores the existing ones with their resolved references', async () => {
        const controllers = setup();

        const response = await run([seed('Existing'), seed('New')]);

        expect(response).toEqual({ success: true });
        expect(controllers.create.handle).toHaveBeenCalledWith({ ...RESOLVED, name: 'New', prompt: 'New prompt', observation: 'New observation' });
        expect(controllers.edit.handle).toHaveBeenCalledWith({
            id: 'c1',
            editParams: { ...RESOLVED, name: 'Existing', prompt: 'Existing prompt', observation: 'Existing observation' }
        });
    });

    it('resolves missing trait lists to empty lists', async () => {
        const controllers = setup();

        await run([{ ...seed('New'), abilities: undefined, proficiencies: undefined, statuses: undefined } as unknown as ReturnType<typeof seed>]);

        expect(controllers.create.handle).toHaveBeenCalledWith(expect.objectContaining({ abilityIds: [], proficiencyIds: [], statusIds: [] }));
    });

    it('fails without seeding when the characters cannot be listed', async () => {
        const controllers = setup();
        controllers.list.handle.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await run([seed('New')]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to load characters: storage offline' });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it.each([
        ['assistant', { assistant: 'Ghost' }, 'Migration: assistant "Ghost" for character "New" does not exist'],
        ['ability', { abilities: ['Ghost'] }, 'Migration: ability "Ghost" for character "New" does not exist'],
        ['proficiency', { proficiencies: ['Ghost'] }, 'Migration: proficiency "Ghost" for character "New" does not exist'],
        ['status', { statuses: ['Ghost'] }, 'Migration: status "Ghost" for character "New" does not exist']
    ])('fails without creating when the %s reference does not exist', async (_, override, error) => {
        const controllers = setup();

        const response = await run([{ ...seed('New'), ...override }]);

        expect(response).toEqual({ success: false, error });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it('fails when a character cannot be created', async () => {
        const controllers = setup();
        controllers.create.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await run([seed('New')]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to create character "New": refused' });
    });

    it('fails when a character cannot be restored', async () => {
        const controllers = setup();
        controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await run([seed('Existing')]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to restore character "Existing": refused' });
    });
});
