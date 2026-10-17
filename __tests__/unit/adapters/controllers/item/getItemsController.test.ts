import { GetItemsController } from '@adapters/controllers';
import { IGetItemsUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Item } from '@domain/entities';

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

describe('GetItemsController', () => {
    let controller: GetItemsController;

    beforeEach(() => {
        controller = new GetItemsController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetItemsUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetItemsController::handle');
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

    it('should execute use case and return items list', async () => {
        const mockItems: Item[] = [
            {
                id: '1',
                name: 'Item 1',
                activationWord: 'activate1',
                prompt: 'Prompt 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Item 2',
                activationWord: 'activate2',
                prompt: 'Prompt 2',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockItems);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockItems);
    });

    it('should return empty array when no items exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return items list with single item', async () => {
        const mockItems: Item[] = [
            {
                id: '1',
                name: 'Single Item',
                activationWord: 'activate',
                prompt: 'Single prompt',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockItems);

        const result = await controller.handle();

        expect(result).toEqual(mockItems);
        expect(result.length).toBe(1);
    });
});
