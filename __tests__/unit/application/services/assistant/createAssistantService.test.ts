import { CreateAssistantService } from '@application/services/assistant';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateAssistantServiceParams } from '@domain/services';

const NOW = '2026-06-15T12:00:00.000Z';

const mockLogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockIdGenerator = {
    generate: jest.fn()
};

function createParams (): Required<CreateAssistantServiceParams> {
    return {
        name: 'Remote Qwen',
        observation: 'Runs on the server',
        modelId: 'model-2',
        samplerId: 'sampler-2',
        connectionId: 'connection-2'
    };
}

describe('CreateAssistantService', () => {
    let service: CreateAssistantService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateAssistantService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', async () => {
        await service.createAssistant(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Execute CreateAssistantService::createAssistant');
    });

    it('should generate the id once', async () => {
        await service.createAssistant(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created assistant with every entity field', async () => {
        const params: Required<CreateAssistantServiceParams> = createParams();

        const response = await service.createAssistant(params);

        expect(response).toStrictEqual({
            success: true,
            assistant: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', async () => {
        const response = await service.createAssistant({
            name: 'Remote Qwen',
            modelId: 'model-2',
            samplerId: 'sampler-2',
            connectionId: 'connection-2'
        });

        expect(response.assistant?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', async () => {
        const response = await service.createAssistant({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.assistant?.name).toBe('Ação  🔥');
    });

    it('should not mutate the given params', async () => {
        const params = createParams();

        await service.createAssistant(params);

        expect(params).toStrictEqual(createParams());
    });
});
