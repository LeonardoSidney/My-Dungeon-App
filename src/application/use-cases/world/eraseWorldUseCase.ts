import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { IEraseWorldUseCase, EraseWorldUseCaseReturn } from '@domain/use-cases';

export class EraseWorldUseCase implements IEraseWorldUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldRepository: IWorldRepository
    ) { }

    async execute (worldId: string): Promise<EraseWorldUseCaseReturn> {
        this.logger.info('Executing EraseWorldUseCase::execute');

        if (!worldId) {
            return { success: false, error: 'A world id is required to erase a world' };
        }

        const result = await this.worldRepository.eraseWorld(worldId);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase world' };
        }
        return { success: true };
    }
}
