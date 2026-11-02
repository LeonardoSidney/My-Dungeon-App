import { GetModelsFromProviderUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createConnectionHelper, createModelHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const connection = createConnectionHelper({ id: 'c1' });
const models = [createModelHelper({ id: 'm1', connectionId: 'c1' })];

function buildUseCase (connectionResponse: unknown = { success: true, connection }, modelsResponse: unknown = { success: true, models }) {
    const gateway = { getModels: jest.fn().mockResolvedValue(modelsResponse) };
    const repository = { getConnectionById: jest.fn().mockResolvedValue(connectionResponse) };
    const useCase = new GetModelsFromProviderUseCase(logger, gateway as never, repository as never);

    return { useCase, gateway, repository };
}

describe('GetModelsFromProviderUseCase', () => {
    it('returns the models of the connection', async () => {
        const { useCase, gateway, repository } = buildUseCase();

        const response = await useCase.execute({ connectionId: 'c1' });

        expect(response).toEqual({ success: true, models });
        expect(repository.getConnectionById).toHaveBeenCalledWith('c1');
        expect(gateway.getModels).toHaveBeenCalledWith(connection);
    });

    it('fails without loading the connection when the connection id is blank', async () => {
        const { useCase, repository } = buildUseCase();

        const response = await useCase.execute({ connectionId: '  ' });

        expect(response).toEqual({ success: false, error: 'Connection id is required' });
        expect(repository.getConnectionById).not.toHaveBeenCalled();
    });

    it('fails without loading the connection when the connection id is missing', async () => {
        const { useCase, repository } = buildUseCase();

        const response = await useCase.execute({} as never);

        expect(response).toEqual({ success: false, error: 'Connection id is required' });
        expect(repository.getConnectionById).not.toHaveBeenCalled();
    });

    it('returns the repository error when the connection cannot be loaded', async () => {
        const { useCase, gateway } = buildUseCase({ success: false, error: 'Database error' });

        const response = await useCase.execute({ connectionId: 'c1' });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(gateway.getModels).not.toHaveBeenCalled();
    });

    it('fails naming the collection when the connection does not exist', async () => {
        const { useCase, gateway } = buildUseCase({ success: true });

        const response = await useCase.execute({ connectionId: 'c1' });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: c1 from Connections' });
        expect(gateway.getModels).not.toHaveBeenCalled();
    });

    it('returns the gateway error when the models cannot be loaded', async () => {
        const { useCase } = buildUseCase({ success: true, connection }, { success: false, error: 'offline' });

        const response = await useCase.execute({ connectionId: 'c1' });

        expect(response).toEqual({ success: false, error: 'offline' });
    });
});
