import { CreateProficiencyController } from '../../../../src/adapters/controllers/proficiency/createProficiencyController';
import { ICreateProficiencyUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Proficiency } from '@domain/entities';

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

describe('CreateProficiencyController', () => {
    let controller: CreateProficiencyController;

    beforeEach(() => {
        controller = new CreateProficiencyController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateProficiencyUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockProficiency: Proficiency = {
            id: '1',
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            proficiency: mockProficiency
        });

        await controller.handle({
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateProficiencyController::handle');
    });

    it('should call useCase.execute with correct params when handling a request', async () => {
        const mockProficiency: Proficiency = {
            id: '1',
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            proficiency: mockProficiency
        });

        const params = {
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        };

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith(params);
    });

    it('should return proficiency when use case succeeds', async () => {
        const mockProficiency: Proficiency = {
            id: '1',
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            proficiency: mockProficiency
        });

        const response = await controller.handle({
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        });

        expect(response.success).toBe(true);
        expect(response.proficiency).toEqual(mockProficiency);
        expect(response.error).toBeUndefined();
    });

    it('should return error when use case fails', async () => {
        mockUseCase.execute.mockResolvedValue({
            success: false,
            error: 'Failed to create proficiency'
        });

        const response = await controller.handle({
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            observation: 'Test observation'
        });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to create proficiency');
        expect(response.proficiency).toBeUndefined();
    });

    it('should handle params without optional observation field', async () => {
        const mockProficiency: Proficiency = {
            id: '1',
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            proficiency: mockProficiency
        });

        const params = {
            name: 'Test Proficiency',
            prompt: 'Test prompt',
            activationWord: 'activate'
        };

        const response = await controller.handle(params);

        expect(response.success).toBe(true);
        expect(response.proficiency).toEqual(mockProficiency);
        expect(mockUseCase.execute).toHaveBeenCalledWith(params);
    });
});
