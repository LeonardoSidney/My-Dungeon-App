import { CreateStatusController } from '@adapters/controllers';
import { ICreateStatusUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Status } from '@domain/entities';

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

describe('CreateStatusController', () => {
    let controller: CreateStatusController;

    beforeEach(() => {
        controller = new CreateStatusController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateStatusUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockStatus: Status = {
            id: '1',
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            status: mockStatus
        });

        await controller.handle({
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateStatusController::handle');
    });

    it('should call useCase.execute with correct params when handling a request', async () => {
        const mockStatus: Status = {
            id: '1',
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            status: mockStatus
        });

        const params = {
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        };

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith(params);
    });

    it('should return status when use case succeeds', async () => {
        const mockStatus: Status = {
            id: '1',
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            status: mockStatus
        });

        const response = await controller.handle({
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        });

        expect(response.success).toBe(true);
        expect(response.status).toEqual(mockStatus);
    });

    it('should return status without observation when observation is not provided', async () => {
        const mockStatus: Status = {
            id: '1',
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            status: mockStatus
        });

        const response = await controller.handle({
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate'
        });

        expect(response.success).toBe(true);
        expect(response.status).toEqual(mockStatus);
    });

    it('should return error when use case fails', async () => {
        mockUseCase.execute.mockResolvedValue({
            success: false,
            error: 'Failed to create status'
        });

        const response = await controller.handle({
            name: 'Test Status',
            prompt: 'Test prompt',
            activationWord: 'activate'
        });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to create status');
    });
});
