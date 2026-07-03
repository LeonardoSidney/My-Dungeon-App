import { CreateAbilityController } from '../../../../src/adapters/controllers/ability/createAbilityController';
import { CreateAbilityControllerParams, CreateAbilityControllerResponse } from '@domain/controllers';
import { ICreateAbilityUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAbilityHelper } from '../../../../__helpers__/createAbilityHelper';

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

describe('CreateAbilityController', () => {
    let controller: CreateAbilityController;

    beforeEach(() => {
        controller = new CreateAbilityController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateAbilityUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const params: CreateAbilityControllerParams = {
            name: 'Test Ability',
            activationWorld: 'activate',
            prompt: 'Ability prompt'
        };

        const mockResponse: CreateAbilityControllerResponse = {
            success: true,
            ability: createAbilityHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateAbilityController::handle');
    });

    it('should call use case execute with correct parameters', async () => {
        const params: CreateAbilityControllerParams = {
            name: 'Test Ability',
            activationWorld: 'activate',
            prompt: 'Ability prompt'
        };

        const mockResponse: CreateAbilityControllerResponse = {
            success: true,
            ability: createAbilityHelper({ name: 'Test Ability' })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            activationWorld: params.activationWorld,
            prompt: params.prompt,
            observation: undefined
        });
    });

    it('should pass params with optional observation field to use case', async () => {
        const params: CreateAbilityControllerParams = {
            name: 'Test Ability',
            activationWorld: 'activate',
            prompt: 'Ability prompt',
            observation: 'Test observation'
        };

        const mockResponse: CreateAbilityControllerResponse = {
            success: true,
            ability: createAbilityHelper({ name: 'Test Ability' })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            activationWorld: params.activationWorld,
            prompt: params.prompt,
            observation: params.observation
        });
    });

    it('should return success response with ability when use case succeeds', async () => {
        const params: CreateAbilityControllerParams = {
            name: 'Test Ability',
            activationWorld: 'activate',
            prompt: 'Ability prompt'
        };

        const mockAbility = createAbilityHelper({ name: 'Test Ability' });
        const mockResponse: CreateAbilityControllerResponse = {
            success: true,
            ability: mockAbility
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toEqual({
            success: true,
            ability: mockAbility,
            error: undefined
        });
    });

    it('should return error when use case fails', async () => {
        const params: CreateAbilityControllerParams = {
            name: 'Test Ability',
            activationWorld: 'activate',
            prompt: 'Ability prompt'
        };

        const mockResponse: CreateAbilityControllerResponse = {
            success: false,
            error: 'Failed to create ability'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toEqual({
            success: false,
            ability: undefined,
            error: 'Failed to create ability'
        });
    });
});
