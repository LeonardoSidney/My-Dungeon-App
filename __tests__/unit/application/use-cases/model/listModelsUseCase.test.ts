import { ListModelsUseCase } from '@application/use-cases';
import { GetModelsController } from '@adapters/controllers';
import { GetModelsPresenter } from '@adapters/presenters';
import { ILogger } from '@domain/logger';
import { createConnectionHelper, createModelHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const first = createConnectionHelper({ id: 'c1', name: 'Local' });
const second = createConnectionHelper({ id: 'c2', name: 'Remote' });

function buildListModels (modelsByConnection: Record<string, unknown>) {
    const gateway = {
        getModels: jest.fn(async (connection: { id: string; }) => {
            const models = modelsByConnection[connection.id];
            if (models instanceof Error) return { success: false, error: models.message };
            return { success: true, models };
        })
    };
    const repository = { getConnections: jest.fn().mockResolvedValue({ success: true, connections: [first, second] }) };
    return new ListModelsUseCase(logger, gateway as never, repository as never);
}

describe('ListModelsUseCase', () => {
    it('aggregates the models of every connection and skips unreachable ones', async () => {
        const useCase = buildListModels({
            c1: [createModelHelper({ id: 'm1', connectionId: 'c1' })],
            c2: new Error('offline'),
        });

        const response = await useCase.execute();

        expect(response.success).toBe(true);
        expect(response.models?.map(entry => [entry.model.id, entry.connection.id])).toEqual([['m1', 'c1']]);
    });

    it('filters to loaded models when asked', async () => {
        const useCase = buildListModels({
            c1: [createModelHelper({ id: 'm1', loaded: false }), createModelHelper({ id: 'm2', loaded: true })],
            c2: [],
        });

        const response = await useCase.execute({ loadedOnly: true });

        expect(response.models?.map(entry => entry.model.id)).toEqual(['m2']);
    });

    it('returns the repository error when the connections cannot be loaded', async () => {
        const gateway = { getModels: jest.fn() };
        const repository = { getConnections: jest.fn().mockResolvedValue({ success: false, error: 'Database error' }) };
        const useCase = new ListModelsUseCase(logger, gateway as never, repository as never);

        const response = await useCase.execute();

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(gateway.getModels).not.toHaveBeenCalled();
    });
});

describe('GetModelsController', () => {
    it('returns model options already labelled with their connection name', async () => {
        const controller = new GetModelsController(logger, buildListModels({ c1: [], c2: [createModelHelper({ id: 'm9', name: 'Llama', connectionId: 'c2' })] }), new GetModelsPresenter());

        const response = await controller.handle();

        expect(response).toEqual({
            success: true,
            items: [{ id: 'm9', name: 'Llama', connectionId: 'c2', connectionName: 'Remote' }],
            error: undefined,
        });
    });
});
