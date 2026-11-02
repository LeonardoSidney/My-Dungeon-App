import { CreateLocationService } from '@application/services/location';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateLocationServiceParams } from '@domain/services';

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

function createParams (): Required<CreateLocationServiceParams> {
    return {
        name: 'Sunken Temple',
        activationWord: 'temple',
        prompt: 'A flooded temple',
        observation: 'Only reachable by boat'
    };
}

describe('CreateLocationService', () => {
    let service: CreateLocationService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateLocationService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createLocation(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('CreateLocationService::createLocation');
    });

    it('should generate the id once', () => {
        service.createLocation(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created location with every entity field', () => {
        const params: Required<CreateLocationServiceParams> = createParams();

        const response = service.createLocation(params);

        expect(response).toStrictEqual({
            success: true,
            location: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createLocation({
            name: 'Sunken Temple',
            activationWord: 'temple',
            prompt: 'A flooded temple'
        });

        expect(response.location?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createLocation({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.location?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createLocation({ ...createParams(), activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' });

        expect(response.location).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createLocation(params);

        expect(params).toStrictEqual(createParams());
    });
});
