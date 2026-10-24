import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { GetLocationsUseCaseReturn, IGetLocationsUseCase } from '@domain/use-cases';

export class GetLocationsUseCase implements IGetLocationsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly locationRepository: ILocationRepository
    ) { }

    async execute (): Promise<GetLocationsUseCaseReturn> {
        this.logger.info('Executing GetLocationsUseCase::execute');

        const response = await this.locationRepository.getLocations();
        if (!response.success || !response.locations) {
            this.logger.warning('GetLocationsUseCase::execute - failed to load locations', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, locations: response.locations };
    }
}
