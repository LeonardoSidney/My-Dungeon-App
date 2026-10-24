import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { IEraseWorldUseCase, EraseWorldUseCaseReturn, EraseWorldUseCaseParams } from '@domain/use-cases';

export class EraseWorldUseCase implements IEraseWorldUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldRepository: IWorldRepository
    ) { }

    async execute (params: EraseWorldUseCaseParams): Promise<EraseWorldUseCaseReturn> {
        this.logger.info('Executing EraseWorldUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.worldRepository.eraseWorld(params.id);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase world' };
        }
        return { success: true };
    }

    private validate (params: EraseWorldUseCaseParams): string | null {
        if (!params.id) {
            return 'A world id is required to erase a world';
        }

        return null;
    }
}
