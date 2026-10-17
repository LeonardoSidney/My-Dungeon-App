import { EraseAdventuresController } from '@adapters/controllers';
import { IEraseAdventuresUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';

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

describe('EraseAdventuresController', () => {
    let controller: EraseAdventuresController;

    beforeEach(() => {
        controller = new EraseAdventuresController(mockLogger as unknown as ILogger, mockUseCase as unknown as IEraseAdventuresUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue(undefined);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing EraseAdventuresController::handle');
    });

    it('should execute use case', async () => {
        mockUseCase.execute.mockResolvedValue(undefined);

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return void when use case succeeds', async () => {
        mockUseCase.execute.mockResolvedValue(undefined);

        const result = await controller.handle();

        expect(result).toBeUndefined();
    });

    it('should call logger.info exactly once', async () => {
        mockUseCase.execute.mockResolvedValue(undefined);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call logger.info with the correct method and class name', async () => {
        mockUseCase.execute.mockResolvedValue(undefined);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing EraseAdventuresController::handle');
    });

    it('should handle use case rejection', async () => {
        mockUseCase.execute.mockRejectedValue(new Error('Erase failed'));

        await expect(controller.handle()).rejects.toThrow('Erase failed');
    });
});
