import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { EraseLocationUseCaseReturn, IEraseLocationUseCase } from '@domain/use-cases';

export class EraseLocationUseCase implements IEraseLocationUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly locationRepository: ILocationRepository
    ) { }

    async execute (locationId: string): Promise<EraseLocationUseCaseReturn> {
        this.logger.info('Executing EraseLocationUseCase::execute');
        this.logger.debug('Executing EraseLocationUseCase::execute - locationId: ', locationId);

        const result = await this.locationRepository.eraseLocation(locationId);

        if (!result.success) {
            this.logger.warning('Failed to erase location', result);
            return {
                success: false,
                error: result.error || 'Failed to erase location'
            };
        }

        this.logger.info('Location erased successfully');
        return { success: true };
    }
}
