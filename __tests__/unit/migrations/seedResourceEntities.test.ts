import * as container from '@infra/container';
import { seedAbilities } from '@src/migrations/seedAbilities';
import { seedItems } from '@src/migrations/seedItems';
import { seedLocations } from '@src/migrations/seedLocations';
import { seedProficiencies } from '@src/migrations/seedProficiencies';
import { seedStatuses } from '@src/migrations/seedStatuses';
import { seedSystemPrompts } from '@src/migrations/seedSystemPrompts';
import { seedWorlds } from '@src/migrations/seedWorlds';

jest.mock('@infra/container', () => {
    const controllers: Record<string, { handle: jest.Mock; }> = {};
    return new Proxy({}, {
        get: (_, name: string) => (name === '__esModule' ? true : () => (controllers[name] ??= { handle: jest.fn() }))
    });
});

jest.mock('@infra/container/shared', () => ({
    logger: { debug: jest.fn(), storage: jest.fn(), streaming: jest.fn(), info: jest.fn(), warning: jest.fn(), error: jest.fn(), log: jest.fn() }
}));

type ControllerFactory = keyof typeof container;
type Seed = Record<string, string> & { name: string; };

function controller (factory: ControllerFactory): { handle: jest.Mock; } {
    return (container[factory] as unknown as () => { handle: jest.Mock; })();
}

const RESOURCE_SEED = (name: string): Seed => ({ name, activationWord: 'activate', prompt: `${name} prompt`, observation: `${name} observation` });
const RESOURCE_EDIT = (seed: Seed) => ({ name: seed.name, activationWord: seed.activationWord, prompt: seed.prompt, observation: seed.observation });

const CASES = [
    { run: seedAbilities, entity: 'ability', entities: 'abilities', create: 'createAbilityController', edit: 'editAbilityController', list: 'getAbilitiesController' },
    { run: seedItems, entity: 'item', entities: 'items', create: 'createItemController', edit: 'editItemController', list: 'getItemsController' },
    { run: seedLocations, entity: 'location', entities: 'locations', create: 'createLocationController', edit: 'editLocationController', list: 'getLocationsController' },
    { run: seedProficiencies, entity: 'proficiency', entities: 'proficiencies', create: 'createProficiencyController', edit: 'editProficiencyController', list: 'getProficienciesController' },
    { run: seedStatuses, entity: 'status', entities: 'statuses', create: 'createStatusController', edit: 'editStatusController', list: 'getStatusesController' },
    { run: seedWorlds, entity: 'world', entities: 'worlds', create: 'createWorldController', edit: 'editWorldController', list: 'getWorldsController' },
].map(entry => ({ ...entry, seed: RESOURCE_SEED, editParams: RESOURCE_EDIT }));

const SYSTEM_PROMPT_CASE = {
    run: seedSystemPrompts,
    entity: 'system prompt',
    entities: 'system prompts',
    create: 'createSystemPromptController',
    edit: 'editSystemPromptController',
    list: 'getSystemPromptsController',
    seed: (name: string): Seed => ({ name, content: `${name} content`, observation: `${name} observation` }),
    editParams: (seed: Seed) => ({ name: seed.name, content: seed.content, observation: seed.observation })
};

describe.each([...CASES, SYSTEM_PROMPT_CASE])('$run.name', ({ run, entity, entities, create, edit, list, seed, editParams }) => {
    const existingSeed = seed('Existing');
    const newSeed = seed('New');

    function setup () {
        const controllers = {
            create: controller(create as ControllerFactory),
            edit: controller(edit as ControllerFactory),
            list: controller(list as ControllerFactory)
        };
        controllers.list.handle.mockResolvedValue({ success: true, items: [{ id: 'e1', name: 'Existing' }] });
        controllers.create.handle.mockResolvedValue({ success: true });
        controllers.edit.handle.mockResolvedValue({ success: true });
        return controllers;
    }

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it(`creates the missing ${entities} and restores the existing ones`, async () => {
        const controllers = setup();

        const response = await (run as (seeds: Seed[]) => Promise<unknown>)([existingSeed, newSeed]);

        expect(response).toEqual({ success: true });
        expect(controllers.create.handle).toHaveBeenCalledTimes(1);
        expect(controllers.create.handle).toHaveBeenCalledWith(newSeed);
        expect(controllers.edit.handle).toHaveBeenCalledWith({ id: 'e1', editParams: editParams(existingSeed) });
    });

    it(`fails without seeding when the ${entities} cannot be listed`, async () => {
        const controllers = setup();
        controllers.list.handle.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await (run as (seeds: Seed[]) => Promise<unknown>)([newSeed]);

        expect(response).toEqual({ success: false, error: `Migration: failed to load ${entities}: storage offline` });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it(`fails when a ${entity} cannot be created`, async () => {
        const controllers = setup();
        controllers.create.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await (run as (seeds: Seed[]) => Promise<unknown>)([newSeed]);

        expect(response).toEqual({ success: false, error: `Migration: failed to create ${entity} "New": refused` });
    });

    it(`fails when a ${entity} cannot be restored`, async () => {
        const controllers = setup();
        controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await (run as (seeds: Seed[]) => Promise<unknown>)([existingSeed]);

        expect(response).toEqual({ success: false, error: `Migration: failed to restore ${entity} "Existing": refused` });
    });
});
