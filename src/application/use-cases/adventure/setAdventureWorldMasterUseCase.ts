import { ILogger } from '@domain/logger';
import { IAdventureRepository, IWorldMasterRepository } from '@domain/repository';
import { ISetAdventureWorldMasterService } from '@domain/services';
import {
    ISetAdventureWorldMasterUseCase,
    SetAdventureWorldMasterUseCaseParams,
    SetAdventureWorldMasterUseCaseReturn,
} from '@domain/use-cases';

export class SetAdventureWorldMasterUseCase implements ISetAdventureWorldMasterUseCase {
    constructor (
    private readonly logger: ILogger,
    private readonly service: ISetAdventureWorldMasterService,
    private readonly adventureRepository: IAdventureRepository,
    private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (params: SetAdventureWorldMasterUseCaseParams): Promise<SetAdventureWorldMasterUseCaseReturn> {
        this.logger.info('Executing SetAdventureWorldMasterUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const worldMasterResponse = await this.worldMasterRepository.getWorldMasterById(params.worldMasterId);
        if (!worldMasterResponse.success) {
            this.logger.warning('SetAdventureWorldMasterUseCase::execute - failed to load world master', worldMasterResponse.error);
            return { success: false, error: worldMasterResponse.error };
        }

        const worldMaster = worldMasterResponse.worldMaster;
        if (!worldMaster) {
            return { success: false, error: `World master with id ${params.worldMasterId} not found` };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('SetAdventureWorldMasterUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const response = this.service.setWorldMaster({ adventure, worldMasterId: worldMaster.id });
        if (!response.success || !response.adventure) {
            return { success: false, error: response.error ?? 'Failed to set world master' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            return { success: false, error: update.error ?? 'Failed to save world master' };
        }

        return { success: true };
    }

    private validate (params: SetAdventureWorldMasterUseCaseParams): string | null {
        if (!params.adventureId.trim() || !params.worldMasterId.trim()) {
            return 'Adventure id and world master id are required';
        }

        return null;
    }
}
