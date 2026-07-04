import { GetProficienciesController } from '../../../../src/adapters/controllers/proficiency/getProficienciesController';
import { IGetProficienciesUseCase } from '@domain/use-cases';
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

describe('GetProficienciesController', () => {
    let controller: GetProficienciesController;

    beforeEach(() => {
        controller = new GetProficienciesController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetProficienciesUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockProficiencies: Proficiency[] = [
            {
                id: '1',
                name: 'Test Proficiency 1',
                prompt: 'Test prompt 1',
                activationWord: 'activate1',
                observation: 'Test observation 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Test Proficiency 2',
                prompt: 'Test prompt 2',
                activationWord: 'activate2',
                observation: 'Test observation 2',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockProficiencies);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetProficienciesController::handle');
    });

    it('should call useCase.execute when handling a request', async () => {
        const mockProficiencies: Proficiency[] = [
            {
                id: '1',
                name: 'Test Proficiency',
                prompt: 'Test prompt',
                activationWord: 'activate',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockProficiencies);

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should return proficiencies when use case succeeds', async () => {
        const mockProficiencies: Proficiency[] = [
            {
                id: '1',
                name: 'Proficiency 1',
                prompt: 'Prompt 1',
                activationWord: 'activate1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Proficiency 2',
                prompt: 'Prompt 2',
                activationWord: 'activate2',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockProficiencies);

        const response = await controller.handle();

        expect(response).toEqual(mockProficiencies);
        expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should return empty array when no proficiencies exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const response = await controller.handle();

        expect(response).toEqual([]);
        expect(response.length).toBe(0);
    });

    it('should return single proficiency', async () => {
        const mockProficiency: Proficiency = {
            id: '1',
            name: 'Single Proficiency',
            prompt: 'Single prompt',
            activationWord: 'activate',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue([mockProficiency]);

        const response = await controller.handle();

        expect(response).toEqual([mockProficiency]);
        expect(response.length).toBe(1);
    });
});
