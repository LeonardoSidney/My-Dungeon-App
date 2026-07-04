import { GetWorldMastersController } from '@adapters/controllers';
import { IGetWorldMastersUseCase } from '@domain/use-cases';
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

describe('GetWorldMastersController', () => {
    let controller: GetWorldMastersController;

    beforeEach(() => {
        controller = new GetWorldMastersController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetWorldMastersUseCase);
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

        const mockWorldMasters: WorldMaster[] = [
            {
                id: '1',
                name: 'WorldMaster 1',
                activationWord: 'activate',
                prompt: 'WorldMaster 1 prompt',
                observation: 'Observation 1',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'WorldMaster 2',
                activationWord: 'enter',
                prompt: 'WorldMaster 2 prompt',
                observation: 'Observation 2',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorldMasters);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetWorldMastersController::handle');
    });

    it('should execute use case and return world masters list', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockWorldMasters: WorldMaster[] = [
            {
                id: '1',
                name: 'Fantasy WorldMaster',
                activationWord: 'magic',
                prompt: 'A magical fantasy realm',
                observation: 'Dragons and castles',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Sci-Fi WorldMaster',
                activationWord: 'warp',
                prompt: 'A futuristic sci-fi universe',
                observation: 'Spaceships and aliens',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                name: 'Medieval WorldMaster',
                activationWord: 'knight',
                prompt: 'A medieval kingdom',
                observation: undefined,
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorldMasters);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
        expect(result).toEqual(mockWorldMasters);
        expect(result).toHaveLength(3);
    });

    it('should return empty array when no world masters exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it('should return single world master', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockWorldMasters: WorldMaster[] = [
            {
                id: '1',
                name: 'Only WorldMaster',
                activationWord: 'summon',
                prompt: 'The only master',
                observation: 'Unique observation',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorldMasters);

        const result = await controller.handle();

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Only WorldMaster');
    });

    it('should return world masters with different observation values', async () => {
        const mockAssistant: Assistant = {
            id: '1',
            name: 'Test Assistant',
            observation: 'Test observation',
            model: {} as any,
            sampler: {} as any,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockWorldMasters: WorldMaster[] = [
            {
                id: '1',
                name: 'With Observation',
                activationWord: 'go',
                prompt: 'Prompt 1',
                observation: 'Has observation',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Without Observation',
                activationWord: 'go',
                prompt: 'Prompt 2',
                observation: undefined,
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                name: 'Empty Observation',
                activationWord: 'go',
                prompt: 'Prompt 3',
                observation: '',
                assistant: mockAssistant,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockWorldMasters);

        const result = await controller.handle();

        expect(result).toHaveLength(3);
        expect(result[0].observation).toBe('Has observation');
        expect(result[1].observation).toBeUndefined();
        expect(result[2].observation).toBe('');
    });
});
