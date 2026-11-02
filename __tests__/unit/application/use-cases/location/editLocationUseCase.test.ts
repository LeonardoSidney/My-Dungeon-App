import { EditLocationUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { LocationEditParams, IEditLocationService } from '@domain/services';
import { createLocationHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockRepository = {
    getLocationById: jest.fn(),
    getLocations: jest.fn(),
    editLocation: jest.fn()
};

const mockService = {
    editLocation: jest.fn()
};

const storedLocation = createLocationHelper({ id: 'location-1', name: 'Stored name' });
const editedLocation = createLocationHelper({ id: 'location-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<LocationEditParams>): LocationEditParams {
    return {
        name: 'Edited name',
        activationWord: 'activate',
        prompt: 'A prompt',
        ...overrides
    };
}

function buildUseCase (): EditLocationUseCase {
    return new EditLocationUseCase(
        mockLogger,
        mockService as unknown as IEditLocationService,
        mockRepository as unknown as ILocationRepository
    );
}

describe('EditLocationUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.getLocationById.mockResolvedValue({ success: true, location: storedLocation });
        mockRepository.getLocations.mockResolvedValue({ success: true, locations: [storedLocation] });
        mockRepository.editLocation.mockResolvedValue({ success: true });
        mockService.editLocation.mockReturnValue({ success: true, location: editedLocation });
    });

    it('should save the edited location and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(mockRepository.editLocation).toHaveBeenCalledWith({ location: editedLocation });
        expect(response).toEqual({ success: true, id: 'location-1' });
    });

    it('should pass the stored location and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'location-1', editParams });

        expect(mockService.editLocation).toHaveBeenCalledWith({ location: storedLocation, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a location' });
        expect(mockRepository.getLocationById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a location' });
        expect(mockRepository.getLocationById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a location' });
    });

    it('should fail when the activationWord is blank', async () => {
        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit a location' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit a location' });
    });

    it('should fail when the location cannot be loaded', async () => {
        mockRepository.getLocationById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editLocation).not.toHaveBeenCalled();
    });

    it('should fail when the location does not exist', async () => {
        mockRepository.getLocationById.mockResolvedValue({ success: true, location: undefined });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Location with id location-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editLocation.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editLocation.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditLocationService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editLocation.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a location' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getLocations.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editLocation).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getLocations.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editLocation).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getLocations.mockResolvedValue({
            success: true,
            locations: [createLocationHelper({ id: 'location-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Location with name Edited name already exists' });
        expect(mockRepository.editLocation).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getLocations.mockResolvedValue({ success: true, locations: [editedLocation] });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getLocations.mockResolvedValue({
            success: true,
            locations: [createLocationHelper({ id: 'location-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editLocation.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editLocation.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'location-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit location' });
    });
});
