import { GetWorldsController } from '../../../../src/adapters/controllers/world/getWorldsController';
import { IGetWorldsUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { World } from '@domain/entities';

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

describe('GetWorldsController', () => {
    let controller: GetWorldsController;

    beforeEach(() => {
        controller = new GetWorldsController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetWorldsUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockWorlds: World[] = [
            {
                id: '1',
                name: 'World 1',
                activationWord: 'activate',
                prompt: 'World 1 prompt',
                observation: 'Observation 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'World 2',
                activationWord: 'enter',
                prompt: 'World 2 prompt',
                observation: 'Observation 2',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorlds);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetWorldsController::handle');
    });

    it('should execute use case and return worlds list', async () => {
        const mockWorlds: World[] = [
            {
                id: '1',
                name: 'Fantasy World',
                activationWord: 'magic',
                prompt: 'A magical fantasy realm',
                observation: 'Dragons and castles',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Sci-Fi World',
                activationWord: 'warp',
                prompt: 'A futuristic sci-fi universe',
                observation: 'Spaceships and aliens',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                name: 'Medieval World',
                activationWord: 'knight',
                prompt: 'A medieval kingdom',
                observation: undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorlds);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
        expect(result).toEqual(mockWorlds);
        expect(result).toHaveLength(3);
    });

    it('should return empty array when no worlds exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it('should return single world when one exists', async () => {
        const mockWorlds: World[] = [
            {
                id: '1',
                name: 'Only World',
                activationWord: 'only',
                prompt: 'The only world',
                observation: undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorlds);

        const result = await controller.handle();

        expect(result).toEqual(mockWorlds);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Only World');
    });
});
