import { CreateStatusService } from '@application/services/status';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateStatusServiceParams } from '@domain/services';

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

function createParams (): Required<CreateStatusServiceParams> {
    return {
        name: 'Poisoned',
        activationWord: 'poison',
        prompt: 'Weakened by venom',
        observation: 'Lasts three days'
    };
}

describe('CreateStatusService', () => {
    let service: CreateStatusService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateStatusService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createStatus(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateStatusService::createStatus');
    });

    it('should generate the id once', () => {
        service.createStatus(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created status with every entity field', () => {
        const params: Required<CreateStatusServiceParams> = createParams();

        const response = service.createStatus(params);

        expect(response).toStrictEqual({
            success: true,
            status: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createStatus({
            name: 'Poisoned',
            activationWord: 'poison',
            prompt: 'Weakened by venom'
        });

        expect(response.status?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createStatus({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.status?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createStatus({ ...createParams(), activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' });

        expect(response.status).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createStatus(params);

        expect(params).toStrictEqual(createParams());
    });
});
