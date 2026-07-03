import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { ICreateLocationService } from '@domain/services';
import { CreateLocationUseCaseParams, CreateLocationUseCaseResponse, ICreateLocationUseCase } from '@domain/use-cases';

export class CreateLocationUseCase implements ICreateLocationUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly locationRepository: ILocationRepository,
        private readonly service: ICreateLocationService
    ) { }

    async execute(params: CreateLocationUseCaseParams): Promise<CreateLocationUseCaseResponse> {
        this.logger.info('Executing CreateLocationUseCase::execute');
        this.logger.debug('CreateLocationUseCase::execute - params:', params);

        this.validate(params);

        const response = this.service.createLocation(params);
        this.logger.debug('CreateLocationService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.location) {
            throw new Error('Something went wrong when tried to create the location');
        }

        const locations = await this.locationRepository.getLocations();
        this.logger.debug('LocationRepository executed successfully', locations);
        const alreadyExists = locations.find((location) => location.name === response.location?.name);

        if (alreadyExists) {
            this.logger.warning(`Location with name ${response.location.name} already exists`);
            return {
                success: false,
                error: `Location with name ${response.location.name} already exists`
            };
        }

        await this.locationRepository.saveLocation({ location: response.location });

        return {
            success: true,
            location: response.location
        };
    }

    private validate(params: CreateLocationUseCaseParams): void {
        if (!params.name?.trim()) {
            throw new Error('Name is required to create a location');
        }

        if (!params.prompt?.trim()) {
            throw new Error('Prompt is required to create a location');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('Activation word is required to create a location');
        }
    }
}
