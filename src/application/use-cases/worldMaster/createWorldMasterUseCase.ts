import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import { ICreateWorldMasterService } from '@domain/services';
import { CreateWorldMasterUseCaseParams, CreateWorldMasterUseCaseResponse, ICreateWorldMasterUseCase } from '@domain/use-cases';

export class CreateWorldMasterUseCase implements ICreateWorldMasterUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository,
        private readonly service: ICreateWorldMasterService
    ) { }

    async execute(params: CreateWorldMasterUseCaseParams): Promise<CreateWorldMasterUseCaseResponse> {
        this.logger.info('Executing CreateWorldMasterUseCase::execute');
        this.logger.debug('CreateWorldMasterUseCase::execute - params:', params);

        this.validate(params);

        this.logger.debug('Calling CreateWorldMasterService', params);
        const response = this.service.createWorldMaster(params);
        this.logger.debug('CreateWorldMasterService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.worldMaster) {
            throw new Error('Something went wrong when tried to create the world master');
        }

        const worldMasters = await this.worldMasterRepository.getWorldMasters();
        this.logger.debug('WorldMasterRepository executed successfully', worldMasters);
        const alreadyExists = worldMasters.find((wm) => wm.name === response.worldMaster?.name);

        if (alreadyExists) {
            this.logger.warning(`World master with name ${response.worldMaster.name} already exists`);
            return {
                success: false,
                error: `World master with name ${response.worldMaster.name} already exists`
            };
        }

        await this.worldMasterRepository.saveWorldMaster({ worldMaster: response.worldMaster });

        return {
            success: true,
            worldMaster: response.worldMaster
        };
    }

    validate(params: CreateWorldMasterUseCaseParams): void {
        if (!params.name?.trim()) {
            throw new Error('Name is required to create a world master');
        }

        if (!params.prompt?.trim()) {
            throw new Error('Prompt is required to create a world master');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('Activation word is required to create a world master');
        }
    }
}
