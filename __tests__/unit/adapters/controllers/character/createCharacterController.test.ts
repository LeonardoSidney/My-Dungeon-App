import { CreateCharacterController } from '@adapters/controllers';
import { CreateCharacterControllerPrams, CreateCharacterControllerResponse } from '@domain/controllers';
import { ICreateCharacterUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAttributeHelper, createCharacterHelper } from '@test/helpers';

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

describe('CreateCharacterController', () => {
    let controller: CreateCharacterController;

    beforeEach(() => {
        controller = new CreateCharacterController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateCharacterUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateCharacterController::handle');
    });

    it('should call use case execute with correct parameters', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper({ id: '1', name: 'Test Character' })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            activationWord: params.activationWord,
            prompt: params.prompt,
            observation: params.observation,
            abilityIds: params.abilityIds,
            proficiencyIds: params.proficiencyIds,
            statusIds: params.statusIds,
            attributes: params.attributes,
            assistantId: params.assistantId
        });
    });

    it('should pass params with optional fields to use case', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            abilityIds: ['1'],
            proficiencyIds: ['1'],
            statusIds: ['1'],
            attributes: [createAttributeHelper({ name: 'STR', value: 10 })],
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper({ id: '1', name: 'Test Character' })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            activationWord: params.activationWord,
            prompt: params.prompt,
            observation: params.observation,
            abilityIds: params.abilityIds,
            proficiencyIds: params.proficiencyIds,
            statusIds: params.statusIds,
            attributes: params.attributes,
            assistantId: params.assistantId
        });
    });

    it('should return success response with character when use case succeeds', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockCharacter = createCharacterHelper({ id: '1', name: 'Test Character' });
        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: mockCharacter
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toEqual({
            success: true,
            character: mockCharacter,
            error: undefined
        });
    });

    it('should return success false with error when use case fails', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: false,
            character: undefined,
            error: 'Character creation failed'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result.success).toBe(false);
        expect(result.character).toBeUndefined();
        expect(result.error).toBe('Character creation failed');
    });

    it('should return response with success true and error undefined when successful', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result.success).toBe(true);
        expect(result.character).toBeDefined();
        expect(result.error).toBeUndefined();
    });

    it('should call logger.info exactly once', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call use case execute exactly once', async () => {
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });
});
