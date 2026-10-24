import * as container from '@infra/container';
import { seedAssistants } from '@src/migrations/seedAssistants';
import { MODEL_ID_PLACEHOLDER } from '@src/migrations/shared';
import { createModelHelper } from '@test/helpers';

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

const CONNECTION = { id: 'connection-1', name: 'Local', ip: 'localhost', port: 8080 };
const MODELS = [createModelHelper({ id: 'model-a' }), createModelHelper({ id: 'model-b' })];
const seed = (name: string, modelId = 'model-b') => ({ name, modelId, sampler: 'Creative', observation: `${name} observation` });

function setup () {
    const controllers = {
        create: controller('createAssistantController'),
        edit: controller('editAssistantController'),
        list: controller('getAssistantsController'),
        samplers: controller('getSamplersController')
    };
    controllers.samplers.handle.mockResolvedValue({ success: true, items: [{ id: 'sampler-1', name: 'Creative' }] });
    controllers.list.handle.mockResolvedValue({ success: true, items: [{ id: 'a1', name: 'Existing' }] });
    controllers.create.handle.mockResolvedValue({ success: true });
    controllers.edit.handle.mockResolvedValue({ success: true });
    return controllers;
}

describe('seedAssistants', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('creates the missing assistants and restores the existing ones on the active connection', async () => {
        const controllers = setup();

        const response = await seedAssistants([seed('Existing'), seed('New')], CONNECTION, MODELS);

        expect(response).toEqual({ success: true });
        const resolved = { modelId: 'model-b', samplerId: 'sampler-1', connectionId: 'connection-1' };
        expect(controllers.create.handle).toHaveBeenCalledWith({ ...resolved, name: 'New', observation: 'New observation' });
        expect(controllers.edit.handle).toHaveBeenCalledWith({ id: 'a1', editParams: { ...resolved, name: 'Existing', observation: 'Existing observation' } });
    });

    it('resolves the placeholder model to the first model of the connection', async () => {
        const controllers = setup();

        await seedAssistants([seed('New', MODEL_ID_PLACEHOLDER)], CONNECTION, MODELS);

        expect(controllers.create.handle).toHaveBeenCalledWith(expect.objectContaining({ modelId: 'model-a' }));
    });

    it('fails when the placeholder model is used on a connection without models', async () => {
        setup();

        const response = await seedAssistants([seed('New', MODEL_ID_PLACEHOLDER)], CONNECTION, []);

        expect(response).toEqual({ success: false, error: 'Migration: connection "Local" has no models' });
    });

    it('fails when the model of an assistant is not loaded on the connection', async () => {
        setup();

        const response = await seedAssistants([seed('New', 'model-z')], CONNECTION, MODELS);

        expect(response).toEqual({ success: false, error: 'Migration: model "model-z" is not loaded on connection "Local"' });
    });

    it('fails when the sampler of an assistant does not exist', async () => {
        setup();

        const response = await seedAssistants([{ ...seed('New'), sampler: 'Ghost' }], CONNECTION, MODELS);

        expect(response).toEqual({ success: false, error: 'Migration: sampler "Ghost" does not exist' });
    });

    it.each([
        ['samplers', 'samplers'],
        ['list', 'assistants']
    ] as const)('fails without seeding when the %s cannot be listed', async (key, label) => {
        const controllers = setup();
        controllers[key].handle.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await seedAssistants([seed('New')], CONNECTION, MODELS);

        expect(response).toEqual({ success: false, error: `Migration: failed to load ${label}: storage offline` });
        expect(controllers.create.handle).not.toHaveBeenCalled();
    });

    it('fails when an assistant cannot be created', async () => {
        const controllers = setup();
        controllers.create.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await seedAssistants([seed('New')], CONNECTION, MODELS);

        expect(response).toEqual({ success: false, error: 'Migration: failed to create assistant "New": refused' });
    });

    it('fails when an assistant cannot be restored', async () => {
        const controllers = setup();
        controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

        const response = await seedAssistants([seed('Existing')], CONNECTION, MODELS);

        expect(response).toEqual({ success: false, error: 'Migration: failed to restore assistant "Existing": refused' });
    });
});
