import { CreateCharacterController } from '../../../../src/adapters/controllers/character/createCharacterController';
import { CreateCharacterControllerPrams, CreateCharacterControllerResponse } from '@domain/controllers';
import { ICreateCharacterUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createCharacterHelper } from '../../../../__helpers__/createCharacterHelper';
import { createAssistantHelper } from '../../../../__helpers__/createAssistantHelper';
import { createAbilityHelper } from '../../../../__helpers__/createAbilityHelper';
import { createProficiencyHelper } from '../../../../__helpers__/createProficiencyHelper';
import { createStatusHelper } from '../../../../__helpers__/createStatusHelper';
import { createAttributeHelper } from '../../../../__helpers__/createAttributeHelper';

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
            assistant: createAssistantHelper()
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
        const assistant = createAssistantHelper({ id: '1', name: 'Test Assistant' });
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistant
        };

        const mockResponse: CreateCharacterControllerResponse = {
            success: true,
            character: createCharacterHelper({ id: '1', name: 'Test Character', assistant })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            activationWord: params.activationWord,
            prompt: params.prompt,
            observation: params.observation,
            abilities: params.abilities,
            proficiencies: params.proficiencies,
            statuses: params.statuses,
            attributes: params.attributes,
            assistant: params.assistant
        });
    });

    it('should pass params with optional fields to use case', async () => {
        const assistant = createAssistantHelper({ id: '1', name: 'Test Assistant' });
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            abilities: [createAbilityHelper({ id: '1', name: 'Strength' })],
            proficiencies: [createProficiencyHelper({ id: '1', name: 'Swordsmanship' })],
            statuses: [createStatusHelper({ id: '1', name: 'Healthy' })],
            attributes: [createAttributeHelper({ name: 'STR', value: 10 })],
            assistant
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
            abilities: params.abilities,
            proficiencies: params.proficiencies,
            statuses: params.statuses,
            attributes: params.attributes,
            assistant: params.assistant
        });
    });

    it('should return success response with character when use case succeeds', async () => {
        const assistant = createAssistantHelper({ id: '1', name: 'Test Assistant' });
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistant
        };

        const mockCharacter = createCharacterHelper({ id: '1', name: 'Test Character', assistant });
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
        const assistant = createAssistantHelper({ id: '1', name: 'Test Assistant' });
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistant
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
        const assistant = createAssistantHelper({ id: '1', name: 'Test Assistant' });
        const params: CreateCharacterControllerPrams = {
            name: 'Test Character',
            activationWord: 'activate',
            prompt: 'Character prompt',
            observation: 'Test observation',
            assistant
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
            assistant: createAssistantHelper()
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
            assistant: createAssistantHelper()
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
