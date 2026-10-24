import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import {
    GetWorldMasterByIdUseCaseParams,
    GetWorldMasterByIdUseCaseReturn,
    IGetWorldMasterByIdUseCase,
} from '@domain/use-cases';

export class GetWorldMasterByIdUseCase implements IGetWorldMasterByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (params: GetWorldMasterByIdUseCaseParams): Promise<GetWorldMasterByIdUseCaseReturn> {
        this.logger.info('Executing GetWorldMasterByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const worldMasterResponse = await this.worldMasterRepository.getWorldMasterById(params.id);
        if (!worldMasterResponse.success) {
            this.logger.warning('GetWorldMasterByIdUseCase::execute - failed to load world master', worldMasterResponse.error);
            return { success: false, error: worldMasterResponse.error };
        }

        const worldMaster = worldMasterResponse.worldMaster;
        if (!worldMaster) {
            return { success: false, error: `World master with id ${params.id} not found` };
        }

        return { success: true, worldMaster };
    }

    private validate (params: GetWorldMasterByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'World master id is required';
        }

        return null;
    }
}
