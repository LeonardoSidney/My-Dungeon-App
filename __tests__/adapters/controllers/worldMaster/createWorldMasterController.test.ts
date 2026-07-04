import { CreateWorldMasterController } from '@adapters/controllers';
import { ICreateWorldMasterUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { WorldMaster, Assistant } from '@domain/entities';

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

describe('CreateWorldMasterController', () => {
    let controller: CreateWorldMasterController;

    beforeEach(() => {
        controller = new CreateWorldMasterController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateWorldMasterUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockRequest = {
            name: 'Test WorldMaster',
            activationWord: 'activate',
            prompt: 'Master prompt',
            observation: 'Test observation',
            assistant: mockAssistant
        };

        const mockWorldMaster: WorldMaster = {
            id: '1',
            name: 'Test WorldMaster',
            activationWord: 'activate',
            prompt: 'Master prompt',
            observation: 'Test observation',
            assistant: mockAssistant,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            worldMaster: mockWorldMaster,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateWorldMasterController::handle');
    });

    it('should execute use case with correct parameters', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockRequest = {
            name: 'Dungeon Master',
            activationWord: 'start',
            prompt: 'A dark fantasy dungeon master',
            observation: 'You enter a dark dungeon',
            assistant: mockAssistant
        };

        const mockResponse = {
            success: true,
            worldMaster: {
                id: '1',
                name: 'Dungeon Master',
                activationWord: 'start',
                prompt: 'A dark fantasy dungeon master',
                observation: 'You enter a dark dungeon',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: mockRequest.name,
            activationWord: mockRequest.activationWord,
            prompt: mockRequest.prompt,
            observation: mockRequest.observation,
            assistant: mockRequest.assistant
        });
    });

    it('should execute use case without observation when not provided', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockRequest = {
            name: 'Simple WorldMaster',
            activationWord: 'go',
            prompt: 'A simple world master',
            assistant: mockAssistant
        };

        const mockResponse = {
            success: true,
            worldMaster: {
                id: '2',
                name: 'Simple WorldMaster',
                activationWord: 'go',
                prompt: 'A simple world master',
                observation: undefined,
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: mockRequest.name,
            activationWord: mockRequest.activationWord,
            prompt: mockRequest.prompt,
            observation: undefined,
            assistant: mockRequest.assistant
        });
    });

    it('should return success response when use case succeeds', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockRequest = {
            name: 'Success WorldMaster',
            activationWord: 'success',
            prompt: 'Success prompt',
            assistant: mockAssistant
        };

        const mockWorldMaster: WorldMaster = {
            id: '3',
            name: 'Success WorldMaster',
            activationWord: 'success',
            prompt: 'Success prompt',
            observation: undefined,
            assistant: mockAssistant,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            worldMaster: mockWorldMaster,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(true);
        expect(result.worldMaster).toEqual(mockWorldMaster);
        expect(result.error).toBeUndefined();
    });

    it('should return error response when use case fails', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockRequest = {
            name: 'Failed WorldMaster',
            activationWord: 'fail',
            prompt: 'Failed prompt',
            assistant: mockAssistant
        };

        const mockResponse = {
            success: false,
            worldMaster: undefined,
            error: 'Creation failed'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(false);
        expect(result.worldMaster).toBeUndefined();
        expect(result.error).toBe('Creation failed');
    });

    it('should pass assistant object correctly to use case', async () => {
        const mockAssistant: Assistant = {
            id: 'assistant-1',
            name: 'Custom Assistant',
            observation: 'Custom observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockRequest = {
            name: 'Assistant WorldMaster',
            activationWord: 'summon',
            prompt: 'Summon prompt',
            observation: 'Summon observation',
            assistant: mockAssistant
        };

        const mockResponse = {
            success: true,
            worldMaster: {
                id: '4',
                name: 'Assistant WorldMaster',
                activationWord: 'summon',
                prompt: 'Summon prompt',
                observation: 'Summon observation',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                assistant: mockAssistant
            })
        );
    });
});
