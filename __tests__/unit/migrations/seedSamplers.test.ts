import * as container from '@infra/container';
import { seedSamplers } from '@src/migrations/seedSamplers';

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

const SEED = { name: 'Existing', observation: 'For narration', temperature: 0.8, topK: 40 };

function setup (existing: Array<{ id: string; name: string; systemDefault?: boolean; }> = [{ id: 's1', name: 'Existing' }]) {
    const controllers = {
        create: controller('createSamplerController'),
        edit: controller('editSamplerController'),
        list: controller('getSamplersController')
    };
    controllers.list.handle.mockResolvedValue({ success: true, items: existing });
    controllers.create.handle.mockResolvedValue({ success: true });
    controllers.edit.handle.mockResolvedValue({ success: true });
    return controllers;
}

describe('seedSamplers', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('creates the missing samplers and restores every parameter of the existing ones', async () => {
        const controllers = setup();

        const response = await seedSamplers([SEED, { name: 'New' }]);

        expect(response).toEqual({ success: true });
        expect(controllers.create.handle).toHaveBeenCalledWith({ name: 'New' });
        expect(controllers.edit.handle).toHaveBeenCalledWith({
            id: 's1',
            editParams: expect.objectContaining({ name: 'Existing', observation: 'For narration', temperature: 0.8, topK: 40, minP: undefined })
        });
    });

    it('does not restore a system default sampler', async () => {
        const controllers = setup([{ id: 's1', name: 'Existing', systemDefault: true }]);

        const response = await seedSamplers([SEED]);

        expect(response).toEqual({ success: true });
        expect(controllers.edit.handle).not.toHaveBeenCalled();
    });

    it('fails without seeding when the samplers cannot be listed', async () => {
        const controllers = setup();
        controllers.list.handle.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await seedSamplers([SEED]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to load samplers: storage offline' });
        expect(controllers.edit.handle).not.toHaveBeenCalled();
    });

    it('fails when a sampler cannot be created', async () => {
        const controllers = setup();
        controllers.create.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await seedSamplers([{ name: 'New' }]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to create sampler "New": refused' });
    });

    it('fails when a sampler cannot be restored', async () => {
        const controllers = setup();
        controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await seedSamplers([SEED]);

        expect(response).toEqual({ success: false, error: 'Migration: failed to restore sampler "Existing": refused' });
    });
});
