import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';
import { EraseLocationUseCaseReturn, IEraseLocationUseCase, EraseLocationUseCaseParams } from '@domain/use-cases';

export class EraseLocationUseCase implements IEraseLocationUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly locationRepository: ILocationRepository
    ) { }

    async execute (params: EraseLocationUseCaseParams): Promise<EraseLocationUseCaseReturn> {
        this.logger.info('Executing EraseLocationUseCase::execute');
        this.logger.debug('Executing EraseLocationUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.locationRepository.eraseLocation(params.id);

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

    private validate (params: EraseLocationUseCaseParams): string | null {
        if (!params.id) {
            return 'A location id is required to erase a location';
        }

        return null;
    }
}
