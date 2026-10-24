import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { IEditLocationService } from '@domain/services';
import { EditLocationParams, EditLocationReturn, IEditLocationUseCase } from '@domain/use-cases';

export class EditLocationUseCase implements IEditLocationUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditLocationService,
        private readonly locationRepository: ILocationRepository
    ) { }

    async execute (params: EditLocationParams): Promise<EditLocationReturn> {
        this.logger.info('Executing EditLocationUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const locationResponse = await this.locationRepository.getLocationById(id);
        if (!locationResponse.success) {
            this.logger.warning('EditLocationUseCase::execute - failed to load location', locationResponse.error);
            return { success: false, error: locationResponse.error };
        }

        const location = locationResponse.location;
        if (!location) {
            return {
                success: false,
                error: `Location with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditLocationService', { id, editParams });
        const response = this.service.editLocation({ location, editParams });
        this.logger.debug('EditLocationService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditLocationService'
            };
        }

        if (!response.location) {
            return {
                success: false,
                error: 'Success is true but does not have a location'
            };
        }

        const editedLocation = response.location;
        const existingLocationsResponse = await this.locationRepository.getLocations();
        if (!existingLocationsResponse.success || !existingLocationsResponse.locations) {
            this.logger.warning('EditLocationUseCase::execute - failed to load locations', existingLocationsResponse.error);
            return { success: false, error: existingLocationsResponse.error };
        }

        const existingLocations = existingLocationsResponse.locations;
        const duplicateLocation = existingLocations.find(
            (l) => l.name === editedLocation.name && l.id !== editedLocation.id
        );

        if (duplicateLocation) {
            this.logger.warning(`Location with name ${editedLocation.name} already exists`);
            return {
                success: false,
                error: `Location with name ${editedLocation.name} already exists`
            };
        }

        const editResult = await this.locationRepository.editLocation({ location: editedLocation });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit location'
            };
        }

        return {
            id: editedLocation.id,
            success: true
        };
    }

    private validate (params: EditLocationParams): string | null {
        if (!params.id) {
            return 'An id is required to edit a location';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a location';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit a location';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit a location';
        }

        return null;
    }
}
