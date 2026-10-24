import * as container from '@infra/container';
import { fetchConnectionModels, resolveActiveConnection, seedConnections } from '@src/migrations/seedConnections';
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

const LOCAL = { id: 'connection-1', name: 'Local', ip: 'localhost', port: 8080 };
const REMOTE = { id: 'connection-2', name: 'Remote', ip: '10.0.0.2', port: 8080 };

describe('seedConnections', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('fetchConnectionModels', () => {
        it('returns only the loaded models of the connection', async () => {
            const getModels = controller('getModelsFromProviderController');
            getModels.handle.mockResolvedValue({
                success: true,
                models: [createModelHelper({ id: 'loaded', loaded: true }), createModelHelper({ id: 'unloaded', loaded: false })]
            });

            const response = await fetchConnectionModels(LOCAL);

            expect(getModels.handle).toHaveBeenCalledWith({ connectionId: 'connection-1' });
            expect(response.models?.map(model => model.id)).toEqual(['loaded']);
        });

        it('returns every model when all of them are loaded', async () => {
            controller('getModelsFromProviderController').handle.mockResolvedValue({ success: true, models: [createModelHelper({ id: 'loaded', loaded: true })] });

            const response = await fetchConnectionModels(LOCAL);

            expect(response.models?.map(model => model.id)).toEqual(['loaded']);
        });

        it('returns no models when the provider answers without a list', async () => {
            controller('getModelsFromProviderController').handle.mockResolvedValue({ success: true });

            expect(await fetchConnectionModels(LOCAL)).toEqual({ success: true, models: [] });
        });

        it('propagates the provider error', async () => {
            controller('getModelsFromProviderController').handle.mockResolvedValue({ success: false, error: 'offline' });

            expect(await fetchConnectionModels(LOCAL)).toEqual({ success: false, error: 'offline' });
        });
    });

    describe('resolveActiveConnection', () => {
        function modelsByConnection (responses: Record<string, unknown>) {
            controller('getModelsFromProviderController').handle.mockImplementation(async ({ connectionId }: { connectionId: string; }) => responses[connectionId]);
        }

        it('picks the first connection that serves every model of the assistants', async () => {
            const models = [createModelHelper({ id: 'model-a', loaded: true })];
            modelsByConnection({ 'connection-1': { success: true, models } });

            const response = await resolveActiveConnection([LOCAL], [{ name: 'Narrator', modelId: 'model-a', sampler: 'Creative' }]);

            expect(response).toEqual({ success: true, connection: LOCAL, models });
        });

        it.each([
            ['is unreachable', { success: false, error: 'offline' }],
            ['is unreachable without a reason', { success: false }],
            ['has no loaded models', { success: true, models: [] }],
            ['does not serve the assistant models', { success: true, models: [createModelHelper({ id: 'other', loaded: true })] }]
        ])('skips a connection that %s', async (_, localResponse) => {
            const models = [createModelHelper({ id: 'model-a', loaded: true })];
            modelsByConnection({ 'connection-1': localResponse, 'connection-2': { success: true, models } });

            const response = await resolveActiveConnection([LOCAL, REMOTE], [{ name: 'Narrator', modelId: 'model-a', sampler: 'Creative' }]);

            expect(response).toEqual({ success: true, connection: REMOTE, models });
        });

        it('accepts any connection with models for assistants using the placeholder model', async () => {
            const models = [createModelHelper({ id: 'whatever', loaded: true })];
            modelsByConnection({ 'connection-1': { success: true, models } });

            const response = await resolveActiveConnection([LOCAL], [{ name: 'Narrator', modelId: MODEL_ID_PLACEHOLDER, sampler: 'Creative' }]);

            expect(response.connection).toBe(LOCAL);
        });

        it('fails when no connection is valid', async () => {
            modelsByConnection({ 'connection-1': { success: true, models: [] } });

            const response = await resolveActiveConnection([LOCAL], []);

            expect(response).toEqual({ success: false, error: 'Migration: no valid connection found - assistants require a connection serving their models' });
        });
    });

    describe('seedConnections', () => {
        function setup () {
            const controllers = {
                create: controller('createConnectionConfigController'),
                edit: controller('editConnectionController'),
                list: controller('getConnectionsController')
            };
            controllers.list.handle.mockResolvedValue({ success: true, items: [LOCAL] });
            controllers.create.handle.mockResolvedValue({ success: true, id: 'connection-new' });
            controllers.edit.handle.mockResolvedValue({ success: true });
            return controllers;
        }

        it('creates the missing connections, restores the existing ones and returns them all', async () => {
            const controllers = setup();
            const localSeed = { name: 'Local', ip: '127.0.0.1', port: 8081, auth: 'token' };
            const newSeed = { name: 'New', ip: '10.0.0.3', port: 9090 };

            const response = await seedConnections([localSeed, newSeed]);

            expect(controllers.edit.handle).toHaveBeenCalledWith({ id: 'connection-1', editParams: { name: 'Local', ip: '127.0.0.1', port: 8081, auth: 'token' } });
            expect(controllers.create.handle).toHaveBeenCalledWith(newSeed);
            expect(response).toEqual({
                success: true,
                connections: [
                    { id: 'connection-1', name: 'Local', ip: '127.0.0.1', port: 8081 },
                    { id: 'connection-new', name: 'New', ip: '10.0.0.3', port: 9090 }
                ]
            });
        });

        it('fails without seeding when the connections cannot be listed', async () => {
            const controllers = setup();
            controllers.list.handle.mockResolvedValue({ success: false, error: 'storage offline' });

            const response = await seedConnections([{ name: 'New', ip: '10.0.0.3' }]);

            expect(response).toEqual({ success: false, error: 'Migration: failed to load connections: storage offline' });
            expect(controllers.create.handle).not.toHaveBeenCalled();
        });

        it.each([
            [{ success: false, error: 'refused' }, 'refused'],
            [{ success: true }, 'undefined']
        ])('fails when creating a connection answers %j', async (createResponse, reason) => {
            const controllers = setup();
            controllers.create.handle.mockResolvedValue(createResponse);

            const response = await seedConnections([{ name: 'New', ip: '10.0.0.3' }]);

            expect(response).toEqual({ success: false, error: `Migration: failed to create connection "New": ${reason}` });
        });

        it('fails when a connection cannot be restored', async () => {
            const controllers = setup();
            controllers.edit.handle.mockResolvedValue({ success: false, error: 'refused' });

            const response = await seedConnections([{ name: 'Local', ip: 'localhost' }]);

            expect(response).toEqual({ success: false, error: 'Migration: failed to restore connection "Local": refused' });
        });
    });
});
