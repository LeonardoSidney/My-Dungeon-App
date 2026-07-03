import { GetAbilitiesController } from '../../../../src/adapters/controllers/ability/getAbilitiesController';
import { IGetAbilitiesUseCase } from '../../../../src/domain/use-cases';
import { ILogger } from '../../../../src/domain/logger';
import { Ability } from '../../../../src/domain/entities';
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

describe('GetAbilitiesController', () => {
    let controller: GetAbilitiesController;

    beforeEach(() => {
        controller = new GetAbilitiesController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetAbilitiesUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetAbilitiesController::handle');
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

    it('should execute use case and return abilities list', async () => {
        const mockAbilities: Ability[] = [
            createAbilityHelper({ id: '1', name: 'Ability 1' }),
            createAbilityHelper({ id: '2', name: 'Ability 2' })
        ];

        mockUseCase.execute.mockResolvedValue(mockAbilities);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockAbilities);
    });

    it('should return empty array when no abilities exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return abilities list with single item', async () => {
        const mockAbilities: Ability[] = [
            createAbilityHelper({ id: '1', name: 'Single Ability' })
        ];

        mockUseCase.execute.mockResolvedValue(mockAbilities);

        const result = await controller.handle();

        expect(result).toEqual(mockAbilities);
        expect(result.length).toBe(1);
    });
});
