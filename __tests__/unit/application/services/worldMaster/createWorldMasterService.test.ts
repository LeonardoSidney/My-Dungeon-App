import { CreateWorldMasterService } from '@application/services/worldMaster';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateWorldMasterServiceParams } from '@domain/services';

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

function createParams (): Required<CreateWorldMasterServiceParams> {
    return {
        name: 'Sky Warden',
        activationWord: 'warden',
        prompt: 'Narrate the skies',
        observation: 'Prefers light stories',
        assistantId: 'assistant-2'
    };
}

describe('CreateWorldMasterService', () => {
    let service: CreateWorldMasterService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateWorldMasterService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createWorldMaster(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('CreateWorldMasterService::createWorldMaster');
    });

    it('should generate the id once', () => {
        service.createWorldMaster(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created world master with every entity field', () => {
        const params: Required<CreateWorldMasterServiceParams> = createParams();

        const response = service.createWorldMaster(params);

        expect(response).toStrictEqual({
            success: true,
            worldMaster: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createWorldMaster({
            name: 'Sky Warden',
            activationWord: 'warden',
            prompt: 'Narrate the skies',
            assistantId: 'assistant-2'
        });

        expect(response.worldMaster?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createWorldMaster({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.worldMaster?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createWorldMaster({ ...createParams(), activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' });

        expect(response.worldMaster).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createWorldMaster(params);

        expect(params).toStrictEqual(createParams());
    });
});
