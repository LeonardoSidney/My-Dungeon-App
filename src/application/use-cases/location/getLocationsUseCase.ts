import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { IGetLocationsUseCase } from '@domain/use-cases';

export class GetLocationsUseCase implements IGetLocationsUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly locationRepository: ILocationRepository
    ) { }

    async execute(): Promise<Location[]> {
        this.logger.info('Executing GetLocationsUseCase::execute');
        return this.locationRepository.getLocations();
    }
}
