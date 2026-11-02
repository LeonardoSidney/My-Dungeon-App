import { CreateSystemPromptService } from '@application/services/systemPrompt';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateSystemPromptServiceParams } from '@domain/services';

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

function createParams (): Required<CreateSystemPromptServiceParams> {
    return {
        name: 'Combat Rules',
        content: 'Describe every attack',
        observation: 'Used in battles'
    };
}

describe('CreateSystemPromptService', () => {
    let service: CreateSystemPromptService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateSystemPromptService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createSystemPrompt(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('CreateSystemPromptService::createSystemPrompt');
    });

    it('should generate the id once', () => {
        service.createSystemPrompt(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created system prompt with every entity field', () => {
        const params: Required<CreateSystemPromptServiceParams> = createParams();

        const response = service.createSystemPrompt(params);

        expect(response).toStrictEqual({
            success: true,
            systemPrompt: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createSystemPrompt({
            name: 'Combat Rules',
            content: 'Describe every attack'
        });

        expect(response.systemPrompt?.observation).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createSystemPrompt({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.systemPrompt?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createSystemPrompt({ ...createParams(), content: '  Ação 🔥 0\n' });

        expect(response.systemPrompt).toEqual(expect.objectContaining({ content: '  Ação 🔥 0\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createSystemPrompt(params);

        expect(params).toStrictEqual(createParams());
    });
});
