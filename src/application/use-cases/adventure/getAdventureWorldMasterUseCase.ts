import { ILogger } from '@domain/logger';
import { IAdventureRepository, IWorldMasterRepository } from '@domain/repository';
import {
    GetAdventureWorldMasterUseCaseParams,
    GetAdventureWorldMasterUseCaseReturn,
    IGetAdventureWorldMasterUseCase,
} from '@domain/use-cases';

export class GetAdventureWorldMasterUseCase implements IGetAdventureWorldMasterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (params: GetAdventureWorldMasterUseCaseParams): Promise<GetAdventureWorldMasterUseCaseReturn> {
        this.logger.info('Executing GetAdventureWorldMasterUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetAdventureWorldMasterUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        if (!adventure.worldMasterId) {
            return { success: true };
        }

        const worldMasterResponse = await this.worldMasterRepository.getWorldMasterById(adventure.worldMasterId);
        if (!worldMasterResponse.success) {
            this.logger.warning('GetAdventureWorldMasterUseCase::execute - failed to load world master', worldMasterResponse.error);
            return { success: false, error: worldMasterResponse.error };
        }

        const worldMaster = worldMasterResponse.worldMaster;
        if (!worldMaster) {
            return { success: false, error: `World master with id ${adventure.worldMasterId} not found` };
        }

        return { success: true, worldMaster };
    }

    private validate (params: GetAdventureWorldMasterUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
