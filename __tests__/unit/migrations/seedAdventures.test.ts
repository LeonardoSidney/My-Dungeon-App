import * as container from '@infra/container';
import { seedAdventures } from '@src/migrations/seedAdventures';

jest.mock('@infra/container', () => {
    const controllers: Record<string, { handle: jest.Mock; }> = {};
    return new Proxy({}, {
        get: (_, name: string) => (name === '__esModule' ? true : () => (controllers[name] ??= { handle: jest.fn() }))
    });
});

jest.mock('@infra/container/shared', () => ({
    logger: { debug: jest.fn(), info: jest.fn(), warning: jest.fn(), error: jest.fn(), log: jest.fn() }
}));

function controller (factory: keyof typeof container): { handle: jest.Mock; } {
    return (container[factory] as unknown as () => { handle: jest.Mock; })();
}

const CHARACTERS = [{ id: 'c1', name: 'Hero' }, { id: 'c2', name: 'Companion' }];
const WORLD_MASTERS = [{ id: 'wm-1', name: 'Narrator' }];
const SYSTEM_PROMPTS = [{ id: 'sp-1', name: 'Rules' }];
const WORLDS = [{ id: 'w1', name: 'World' }];
const LOCATIONS = [{ id: 'l1', name: 'Tavern' }];
const ITEMS = [{ id: 'i1', name: 'Sword' }];

const seed = (name: string) => ({
    name,
    characters: ['Hero', 'Companion'],
    charactersControlledByAi: ['Companion'],
    worldMaster: 'Narrator' as string | undefined,
    systemPrompts: ['Rules'],
    worlds: ['World'],
    locations: ['Tavern'],
    items: ['Sword']
});

const RESOLVED = {
    playableCharacterIds: ['c1'],
    aiControlledCharacterIds: ['c2'],
    worldMasterId: 'wm-1',
    systemPromptIds: ['sp-1'],
    worldIds: ['w1'],
    locationIds: ['l1'],
    itemIds: ['i1']
};

function setup () {
    const controllers = {
        create: controller('createAdventureController'),
        edit: controller('editAdventureController'),
        list: controller('getAdventuresController')
    };
    controllers.list.handle.mockResolvedValue({ success: true, items: [{ id: 'adv-1', name: 'Existing' }] });
    controllers.create.handle.mockResolvedValue({ success: true });
    controllers.edit.handle.mockResolvedValue({ success: true });
    return controllers;
}

function run (seeds: ReturnType<typeof seed>[]) {
    return seedAdventures(seeds, CHARACTERS, WORLD_MASTERS, SYSTEM_PROMPTS, WORLDS, LOCATIONS, ITEMS);
}

describe('seedAdventures', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('creates the missing adventures and restores the existing ones with their resolved references', async () => {
        const controllers = setup();

        const response = await run([seed('Existing'), seed('New')]);

        expect(response).toEqual({ success: true });
        expect(controllers.create.handle).toHaveBeenCalledWith({ ...RESOLVED, name: 'New' });
        expect(controllers.edit.handle).toHaveBeenCalledWith({
            id: 'adv-1',
            editParams: { ...RESOLVED, name: 'Existing', characterAsWorldMasterId: undefined }
        });
    });

    it('creates an adventure without a world master', async () => {
        const controllers = setup();

        await run([{ ...seed('New'), worldMaster: undefined }]);

        expect(controllers.create.handle).toHaveBeenCalledWith(expect.objectContaining({ worldMasterId: undefined }));
    });

    it('fails without seeding when the adventures cannot be listed', async () => {
        const controllers = setup();
        controllers.list.handle.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await run([seed('New')]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to load adventures: storage offline' });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it.each([
        ['world master', { worldMaster: 'Ghost' }],
        ['character', { characters: ['Ghost'] }],
        ['character', { charactersControlledByAi: ['Ghost'] }],
        ['system prompt', { systemPrompts: ['Ghost'] }],
        ['world', { worlds: ['Ghost'] }],
        ['location', { locations: ['Ghost'] }],
        ['item', { items: ['Ghost'] }]
    ])('fails without creating when a %s reference does not exist (%j)', async (label, override) => {
        const controllers = setup();

        const response = await run([{ ...seed('New'), ...override }]);

        expect(response).toEqual({ success: false, error: `Migration: ${label} "Ghost" for adventure "New" does not exist` });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it('fails when an adventure cannot be created', async () => {
        const controllers = setup();
        controllers.create.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await run([seed('New')]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to create adventure "New": refused' });
    });

    it('fails when an adventure cannot be restored', async () => {
        const controllers = setup();
        controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await run([seed('Existing')]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to restore adventure "Existing": refused' });
    });
});
