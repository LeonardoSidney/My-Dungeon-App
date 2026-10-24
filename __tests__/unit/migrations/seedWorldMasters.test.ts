import * as container from '@infra/container';
import { seedWorldMasters } from '@src/migrations/seedWorldMasters';

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

const ASSISTANTS = [{ id: 'assistant-1', name: 'Narrator' }];
const seed = (name: string) => ({ name, activationWord: 'activate', prompt: `${name} prompt`, observation: `${name} observation`, assistant: 'Narrator' });

function setup () {
    const controllers = {
        create: controller('createWorldMasterController'),
        edit: controller('editWorldMasterController'),
        list: controller('getWorldMastersController')
    };
    controllers.list.handle.mockResolvedValue({ success: true, items: [{ id: 'wm-1', name: 'Existing' }] });
    controllers.create.handle.mockResolvedValue({ success: true });
    controllers.edit.handle.mockResolvedValue({ success: true });
    return controllers;
}

describe('seedWorldMasters', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('creates the missing world masters and restores the existing ones with the resolved assistant', async () => {
        const controllers = setup();

        const response = await seedWorldMasters([seed('Existing'), seed('New')], ASSISTANTS);

        expect(response).toEqual({ success: true });
        expect(controllers.create.handle).toHaveBeenCalledWith({
            name: 'New',
            activationWord: 'activate',
            prompt: 'New prompt',
            observation: 'New observation',
            assistantId: 'assistant-1'
        });
        expect(controllers.edit.handle).toHaveBeenCalledWith({
            id: 'wm-1',
            editParams: {
                name: 'Existing',
                activationWord: 'activate',
                prompt: 'Existing prompt',
                observation: 'Existing observation',
                assistantId: 'assistant-1'
            }
        });
    });

    it('fails without seeding when the world masters cannot be listed', async () => {
        const controllers = setup();
        controllers.list.handle.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await seedWorldMasters([seed('New')], ASSISTANTS);

        expect(response).toEqual({ success: false, error: 'Migration: failed to load world masters: storage offline' });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it('fails when the assistant of a world master does not exist', async () => {
        const controllers = setup();

        const response = await seedWorldMasters([{ ...seed('New'), assistant: 'Ghost' }], ASSISTANTS);

        expect(response).toEqual({ success: false, error: 'Migration: assistant "Ghost" for world master "New" does not exist' });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it('fails when a world master cannot be created', async () => {
        const controllers = setup();
        controllers.create.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await seedWorldMasters([seed('New')], ASSISTANTS);

        expect(response).toEqual({ success: false, error: 'Migration: failed to create world master "New": refused' });
    });

    it('fails when a world master cannot be restored', async () => {
        const controllers = setup();
        controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await seedWorldMasters([seed('Existing')], ASSISTANTS);

        expect(response).toEqual({ success: false, error: 'Migration: failed to restore world master "Existing": refused' });
    });
});
