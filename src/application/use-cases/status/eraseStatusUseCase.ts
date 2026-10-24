import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import { EraseStatusUseCaseReturn, IEraseStatusUseCase, EraseStatusUseCaseParams } from '@domain/use-cases';

export class EraseStatusUseCase implements IEraseStatusUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (params: EraseStatusUseCaseParams): Promise<EraseStatusUseCaseReturn> {
        this.logger.info('Executing EraseStatusUseCase::execute');
        this.logger.debug('Executing EraseStatusUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.statusRepository.eraseStatus(params.id);

        if (!result.success) {
            this.logger.warning('Failed to erase status', result);
            return {
                success: false,
                error: result.error || 'Failed to erase status'
            };
        }

        this.logger.info('Status erased successfully');
        return { success: true };
    }

    private validate (params: EraseStatusUseCaseParams): string | null {
        if (!params.id) {
            return 'A status id is required to erase a status';
        }

        return null;
    }
}
