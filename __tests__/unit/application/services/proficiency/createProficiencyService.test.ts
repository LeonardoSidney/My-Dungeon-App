import { CreateProficiencyService } from '@application/services/proficiency';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateProficiencyServiceParams } from '@domain/services';

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

function createParams (): Required<CreateProficiencyServiceParams> {
    return {
        name: 'Archery',
        activationWord: 'bow',
        prompt: 'Trained with bows',
        observation: 'Learned as a hunter'
    };
}

describe('CreateProficiencyService', () => {
    let service: CreateProficiencyService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateProficiencyService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createProficiency(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateProficiencyService::createProficiency');
    });

    it('should generate the id once', () => {
        service.createProficiency(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created proficiency with every entity field', () => {
        const params: Required<CreateProficiencyServiceParams> = createParams();

        const response = service.createProficiency(params);

        expect(response).toStrictEqual({
            success: true,
            proficiency: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createProficiency({
            name: 'Archery',
            activationWord: 'bow',
            prompt: 'Trained with bows'
        });

        expect(response.proficiency?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createProficiency({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.proficiency?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createProficiency({ ...createParams(), activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' });

        expect(response.proficiency).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createProficiency(params);

        expect(params).toStrictEqual(createParams());
    });
});
