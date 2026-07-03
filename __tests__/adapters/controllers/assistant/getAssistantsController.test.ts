import { GetAssistantsController } from '../../../../src/adapters/controllers/assistant/getAssistantsController';
import { IGetAssistantsUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Assistant } from '@domain/entities';
import { createAssistantHelper } from '../../../../__helpers__/createAssistantHelper';

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

describe('GetAssistantsController', () => {
    let controller: GetAssistantsController;

    beforeEach(() => {
        controller = new GetAssistantsController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetAssistantsUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetAssistantsController::handle');
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

    it('should execute use case and return assistants list', async () => {
        const mockAssistants: Assistant[] = [
            createAssistantHelper({ id: '1', name: 'Assistant 1' }),
            createAssistantHelper({ id: '2', name: 'Assistant 2' })
        ];

        mockUseCase.execute.mockResolvedValue(mockAssistants);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockAssistants);
    });

    it('should return empty array when no assistants exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return assistants list with single item', async () => {
        const mockAssistants: Assistant[] = [
            createAssistantHelper({ id: '1', name: 'Single Assistant' })
        ];

        mockUseCase.execute.mockResolvedValue(mockAssistants);

        const result = await controller.handle();

        expect(result.length).toBe(1);
        expect(result[0]).toEqual(mockAssistants[0]);
    });

    it('should return assistants list with multiple items', async () => {
        const mockAssistants: Assistant[] = [
            createAssistantHelper({ id: '1', name: 'Assistant 1' }),
            createAssistantHelper({ id: '2', name: 'Assistant 2' }),
            createAssistantHelper({ id: '3', name: 'Assistant 3' }),
            createAssistantHelper({ id: '4', name: 'Assistant 4' }),
            createAssistantHelper({ id: '5', name: 'Assistant 5' })
        ];

        mockUseCase.execute.mockResolvedValue(mockAssistants);

        const result = await controller.handle();

        expect(result.length).toBe(5);
        expect(result).toEqual(mockAssistants);
    });

    it('should return the exact result from use case execute', async () => {
        const uniqueAssistants: Assistant[] = [
            createAssistantHelper({ id: 'unique-1', name: 'Unique Assistant' })
        ];

        mockUseCase.execute.mockResolvedValue(uniqueAssistants);

        const result = await controller.handle();

        expect(result).toBe(uniqueAssistants);
    });

    it('should call logger.info with the correct method and class name', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetAssistantsController::handle');
    });

    it('should return undefined if use case returns undefined (edge case)', async () => {
        mockUseCase.execute.mockResolvedValue(undefined as unknown as Assistant[]);

        const result = await controller.handle();

        expect(result).toBeUndefined();
    });

    it('should return assistants with all properties', async () => {
        const mockAssistants: Assistant[] = [
            createAssistantHelper({
                id: '1',
                name: 'Full Assistant',
                observation: 'Test observation'
            })
        ];

        mockUseCase.execute.mockResolvedValue(mockAssistants);

        const result = await controller.handle();

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
        expect(result[0].name).toBe('Full Assistant');
        expect(result[0].observation).toBe('Test observation');
    });

    it('should not call any other logger methods', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.error).not.toHaveBeenCalled();
        expect(mockLogger.warn).not.toHaveBeenCalled();
        expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('should handle assistants with null or undefined properties', async () => {
        const mockAssistants: Assistant[] = [
            createAssistantHelper({ observation: '' })
        ];

        mockUseCase.execute.mockResolvedValue(mockAssistants);

        const result = await controller.handle();

        expect(result).toHaveLength(1);
        expect(result[0].observation).toBe('');
    });
});
