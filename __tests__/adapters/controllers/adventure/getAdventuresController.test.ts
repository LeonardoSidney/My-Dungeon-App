import { GetAdventuresController } from '@adapters/controllers';
import { IGetAdventuresUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Adventure } from '@domain/entities';

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

describe('GetAdventuresController', () => {
    let controller: GetAdventuresController;

    beforeEach(() => {
        controller = new GetAdventuresController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetAdventuresUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetAdventuresController::handle');
    });

    it('should execute use case and return adventures list', async () => {
        const mockAdventures: Adventure[] = [
            { id: '1', name: 'Adventure 1' } as Adventure,
            { id: '2', name: 'Adventure 2' } as Adventure
        ];

        mockUseCase.execute.mockResolvedValue(mockAdventures);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockAdventures);
    });

    it('should return empty array when no adventures exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return adventures list with single item', async () => {
        const mockAdventures: Adventure[] = [
            { id: '1', name: 'Single Adventure' } as Adventure
        ];

        mockUseCase.execute.mockResolvedValue(mockAdventures);

        const result = await controller.handle();

        expect(result.length).toBe(1);
        expect(result[0]).toEqual(mockAdventures[0]);
    });

    it('should return adventures list with multiple items', async () => {
        const mockAdventures: Adventure[] = [
            { id: '1', name: 'Adventure 1' } as Adventure,
            { id: '2', name: 'Adventure 2' } as Adventure,
            { id: '3', name: 'Adventure 3' } as Adventure,
            { id: '4', name: 'Adventure 4' } as Adventure,
            { id: '5', name: 'Adventure 5' } as Adventure
        ];

        mockUseCase.execute.mockResolvedValue(mockAdventures);

        const result = await controller.handle();

        expect(result.length).toBe(5);
        expect(result).toEqual(mockAdventures);
    });

    it('should return the exact result from use case execute', async () => {
        const uniqueAdventures: Adventure[] = [
            { id: 'unique-1', name: 'Unique Adventure' } as Adventure
        ];

        mockUseCase.execute.mockResolvedValue(uniqueAdventures);

        const result = await controller.handle();

        expect(result).toBe(uniqueAdventures);
    });

    it('should call logger.info exactly once', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call logger.info with the correct method and class name', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetAdventuresController::handle');
    });

    it('should return undefined if use case returns undefined (edge case)', async () => {
        mockUseCase.execute.mockResolvedValue(undefined as unknown as Adventure[]);

        const result = await controller.handle();

        expect(result).toBeUndefined();
    });
});
