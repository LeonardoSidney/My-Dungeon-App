import { EraseAdventuresController } from '@adapters/controllers';
import { IEraseAdventuresUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';

// Mock das dependências
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn()
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
        mockUseCase.execute.mockResolvedValue({ success: true });

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing EraseAdventuresController::handle');
    });

    it('should execute use case', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true });

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return the use case result when it succeeds', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true });

        const result = await controller.handle();

        expect(result).toEqual({ success: true });
    });

    it('should call logger.info exactly once', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true });

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call logger.info with the correct method and class name', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true });

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing EraseAdventuresController::handle');
    });

    it('should return the use case failure', async () => {
        mockUseCase.execute.mockResolvedValue({ success: false, error: 'Erase failed' });

        const result = await controller.handle();

        expect(result).toEqual({ success: false, error: 'Erase failed' });
    });
});
