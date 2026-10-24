import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { IEraseConnectionUseCase, EraseConnectionUseCaseReturn, EraseConnectionUseCaseParams } from '@domain/use-cases';

export class EraseConnectionUseCase implements IEraseConnectionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: EraseConnectionUseCaseParams): Promise<EraseConnectionUseCaseReturn> {
        this.logger.info('Executing EraseConnectionUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.connectionRepository.eraseConnection(params.id);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase connection' };
        }
        return { success: true };
    }

    private validate (params: EraseConnectionUseCaseParams): string | null {
        if (!params.id) {
            return 'A connection id is required to erase a connection';
        }

        return null;
    }
}
