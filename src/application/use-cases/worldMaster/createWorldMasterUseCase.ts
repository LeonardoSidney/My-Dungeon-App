import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IWorldMasterRepository,
} from '@domain/repository';
import { ICreateWorldMasterService } from '@domain/services';
import { CreateWorldMasterUseCaseParams, CreateWorldMasterUseCaseResponse, ICreateWorldMasterUseCase } from '@domain/use-cases';
import { checkReferencedId } from '@application/shared/validateReferencedIds';

export class CreateWorldMasterUseCase implements ICreateWorldMasterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository,
        private readonly service: ICreateWorldMasterService,
        private readonly assistantRepository: IAssistantRepository
    ) { }

    async execute (params: CreateWorldMasterUseCaseParams): Promise<CreateWorldMasterUseCaseResponse> {
        this.logger.info('Executing CreateWorldMasterUseCase::execute');
        this.logger.debug('CreateWorldMasterUseCase::execute - params:', params);

        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

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
            return {
                success: false,
                error: 'Something went wrong when tried to create the world master'
            };
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

    validate (params: CreateWorldMasterUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'Name is required to create a world master';
        }

        if (!params.prompt?.trim()) {
            return 'Prompt is required to create a world master';
        }

        if (!params.activationWord?.trim()) {
            return 'Activation word is required to create a world master';
        }

        return null;
    }

    private async validateReferencedIds (params: CreateWorldMasterUseCaseParams): Promise<string | null> {
        return checkReferencedId(
            (id) => this.assistantRepository.getAssistantById(id),
            params.assistantId,
            'Assistant'
        );
    }
}
