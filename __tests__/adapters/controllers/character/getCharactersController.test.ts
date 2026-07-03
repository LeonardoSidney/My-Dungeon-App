import { GetCharactersController } from '../../../../src/adapters/controllers/character/getCharactersController';
import { IGetCharactersUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Character } from '@domain/entities';
import { createCharacterHelper } from '../../../../__helpers__/createCharacterHelper';

// Mock das dependências
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

describe('GetCharactersController', () => {
    let controller: GetCharactersController;

    beforeEach(() => {
        controller = new GetCharactersController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetCharactersUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetCharactersController::handle');
    });

    it('should call logger.info exactly once', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call use case execute exactly once', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should execute use case and return characters list', async () => {
        const mockCharacters: Character[] = [
            createCharacterHelper({ id: '1', name: 'Character 1' }),
            createCharacterHelper({ id: '2', name: 'Character 2' })
        ];

        mockUseCase.execute.mockResolvedValue(mockCharacters);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockCharacters);
    });

    it('should return empty array when no characters exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return characters list with single item', async () => {
        const mockCharacters: Character[] = [
            createCharacterHelper({ id: '1', name: 'Single Character' })
        ];

        mockUseCase.execute.mockResolvedValue(mockCharacters);

        const result = await controller.handle();

        expect(result.length).toBe(1);
        expect(result[0]).toEqual(mockCharacters[0]);
    });

    it('should return characters list with multiple items', async () => {
        const mockCharacters: Character[] = [
            createCharacterHelper({ id: '1', name: 'Character 1' }),
            createCharacterHelper({ id: '2', name: 'Character 2' }),
            createCharacterHelper({ id: '3', name: 'Character 3' }),
            createCharacterHelper({ id: '4', name: 'Character 4' }),
            createCharacterHelper({ id: '5', name: 'Character 5' })
        ];

        mockUseCase.execute.mockResolvedValue(mockCharacters);

        const result = await controller.handle();

        expect(result.length).toBe(5);
        expect(result).toEqual(mockCharacters);
    });

    it('should return success response with characters when use case succeeds', async () => {
        const mockCharacters: Character[] = [
            createCharacterHelper({ id: '1', name: 'Character 1' }),
            createCharacterHelper({ id: '2', name: 'Character 2' })
        ];

        mockUseCase.execute.mockResolvedValue(mockCharacters);

        const result = await controller.handle();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('1');
        expect(result[1].id).toBe('2');
    });
});
