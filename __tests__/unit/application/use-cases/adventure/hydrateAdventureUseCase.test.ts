import { HydrateAdventureUseCase } from '@application/use-cases';
import { IHydrateAdventureService } from '@domain/services';
import { IAdventureRepository } from '@domain/repository';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createHydratedAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockHydrateAdventureService = {
    hydrate: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn()
};

const adventure = createAdventureHelper();

function buildUseCase (): HydrateAdventureUseCase {
    return new HydrateAdventureUseCase(
        mockLogger,
        mockAdventureRepository as unknown as IAdventureRepository,
        mockHydrateAdventureService as unknown as IHydrateAdventureService
    );
}

describe('HydrateAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });
    });

    it('should hydrate the adventure loaded by id', async () => {
        const hydrated = createHydratedAdventureHelper({ adventure });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true, hydrated });
        expect(mockAdventureRepository.getAdventureById).toHaveBeenCalledWith('adventure-1');
        expect(mockHydrateAdventureService.hydrate).toHaveBeenCalledWith({ adventure });
    });

    it('should fail when the adventure id is blank', async () => {
        const response = await buildUseCase().execute({ adventureId: '  ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('should return the repository error when loading fails', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail when the repository does not find the adventure', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adventure-1 not found' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should return the service error when hydration fails', async () => {
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: false, error: 'Some characters were not found' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Some characters were not found' });
        expect(mockLogger.warning).toHaveBeenCalled();
    });

    it('should fail with a generic error when hydration fails without an error', async () => {
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
    });
});
