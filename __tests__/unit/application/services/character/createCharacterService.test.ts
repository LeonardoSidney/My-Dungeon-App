import { CreateCharacterService } from '@application/services/character';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateCharacterServiceParams } from '@domain/services';

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

function createParams (): Required<CreateCharacterServiceParams> {
    return {
        name: 'Luna',
        activationWord: 'luna',
        prompt: 'A curious mage',
        observation: 'Afraid of spiders',
        abilityIds: ['ability-2', 'ability-3'],
        proficiencyIds: ['proficiency-2'],
        statusIds: ['status-2'],
        attributes: [{ name: 'Wisdom', value: 15 }],
        assistantId: 'assistant-2'
    };
}

describe('CreateCharacterService', () => {
    let service: CreateCharacterService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateCharacterService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createCharacter(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('CreateCharacterService::createCharacter');
    });

    it('should generate the id once', () => {
        service.createCharacter(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created character with every entity field', () => {
        const params: Required<CreateCharacterServiceParams> = createParams();

        const response = service.createCharacter(params);

        expect(response).toStrictEqual({
            success: true,
            character: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createCharacter({
            name: 'Luna',
            activationWord: 'luna',
            prompt: 'A curious mage',
            assistantId: 'assistant-2'
        });

        expect(response.character?.observation).toBeUndefined();
        expect(response.character?.abilityIds).toBeUndefined();
        expect(response.character?.proficiencyIds).toBeUndefined();
        expect(response.character?.statusIds).toBeUndefined();
        expect(response.character?.attributes).toBeUndefined();
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createCharacter({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.character?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createCharacter({ ...createParams(), activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' });

        expect(response.character).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createCharacter(params);

        expect(params).toStrictEqual(createParams());
    });
});
