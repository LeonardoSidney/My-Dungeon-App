import { GetLocationsController } from '@adapters/controllers';
import { IGetLocationsUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Location } from '@domain/entities';

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

describe('GetLocationsController', () => {
    let controller: GetLocationsController;

    beforeEach(() => {
        controller = new GetLocationsController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetLocationsUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockLocations: Location[] = [
            {
                id: '1',
                name: 'Test Location 1',
                activationWord: 'activate1',
                prompt: 'Location prompt 1',
                observation: 'Test observation 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Test Location 2',
                activationWord: 'activate2',
                prompt: 'Location prompt 2',
                observation: 'Test observation 2',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockLocations);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetLocationsController::handle');
    });

    it('should call useCase.execute when handling a request', async () => {
        const mockLocations: Location[] = [
            {
                id: '1',
                name: 'Test Location',
                activationWord: 'activate',
                prompt: 'Location prompt',
                observation: 'Test observation',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockLocations);

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should return locations when use case succeeds', async () => {
        const mockLocations: Location[] = [
            {
                id: '1',
                name: 'Location 1',
                activationWord: 'word1',
                prompt: 'Prompt 1',
                observation: 'Observation 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Location 2',
                activationWord: 'word2',
                prompt: 'Prompt 2',
                observation: 'Observation 2',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                name: 'Location 3',
                activationWord: 'word3',
                prompt: 'Prompt 3',
                observation: 'Observation 3',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockLocations);

        const result = await controller.handle();

        expect(result).toEqual(mockLocations);
        expect(result).toHaveLength(3);
    });

    it('should return empty array when no locations exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it('should return single location when only one exists', async () => {
        const mockLocation: Location = {
            id: '1',
            name: 'Single Location',
            activationWord: 'single',
            prompt: 'Single prompt',
            observation: 'Single observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue([mockLocation]);

        const result = await controller.handle();

        expect(result).toEqual([mockLocation]);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Single Location');
    });

    it('should return locations with different observations', async () => {
        const mockLocations: Location[] = [
            {
                id: '1',
                name: 'Location with observation',
                activationWord: 'obs1',
                prompt: 'Prompt 1',
                observation: 'Detailed observation',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Location without observation',
                activationWord: 'obs2',
                prompt: 'Prompt 2',
                observation: undefined,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockLocations);

        const result = await controller.handle();

        expect(result).toEqual(mockLocations);
        expect(result[0].observation).toBe('Detailed observation');
        expect(result[1].observation).toBeUndefined();
    });
});
