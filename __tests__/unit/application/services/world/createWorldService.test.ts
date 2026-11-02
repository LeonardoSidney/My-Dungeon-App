import { CreateWorldService } from '@application/services/world';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateWorldServiceParams } from '@domain/services';

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

function createParams (): Required<CreateWorldServiceParams> {
    return {
        name: 'Space Colony',
        activationWord: 'station',
        prompt: 'A distant colony',
        observation: 'Futuristic setting'
    };
}

describe('CreateWorldService', () => {
    let service: CreateWorldService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateWorldService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createWorld(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('CreateWorldService::createWorld');
    });

    it('should generate the id once', () => {
        service.createWorld(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created world with every entity field', () => {
        const params: Required<CreateWorldServiceParams> = createParams();

        const response = service.createWorld(params);

        expect(response).toStrictEqual({
            success: true,
            world: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createWorld({
            name: 'Space Colony',
            activationWord: 'station',
            prompt: 'A distant colony'
        });

        expect(response.world?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createWorld({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.world?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createWorld({ ...createParams(), activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' });

        expect(response.world).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createWorld(params);

        expect(params).toStrictEqual(createParams());
    });
});
