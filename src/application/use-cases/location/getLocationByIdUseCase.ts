import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import {
    GetLocationByIdUseCaseParams,
    GetLocationByIdUseCaseReturn,
    IGetLocationByIdUseCase,
} from '@domain/use-cases';

export class GetLocationByIdUseCase implements IGetLocationByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly locationRepository: ILocationRepository
    ) { }

    async execute (params: GetLocationByIdUseCaseParams): Promise<GetLocationByIdUseCaseReturn> {
        this.logger.info('Executing GetLocationByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const locationResponse = await this.locationRepository.getLocationById(params.id);
        if (!locationResponse.success) {
            this.logger.warning('GetLocationByIdUseCase::execute - failed to load location', locationResponse.error);
            return { success: false, error: locationResponse.error };
        }

        const location = locationResponse.location;
        if (!location) {
            return { success: false, error: `Location with id ${params.id} not found` };
        }

        return { success: true, location };
    }

    private validate (params: GetLocationByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Location id is required';
        }

        return null;
    }
}
