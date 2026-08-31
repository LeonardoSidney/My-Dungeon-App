import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IWorldMasterRepository,
} from '@domain/repository';
import { IEditWorldMasterService } from '@domain/services';
import { EditWorldMasterParams, EditWorldMasterReturn, IEditWorldMasterUseCase } from '@domain/use-cases';
import { checkReferencedId } from '@application/shared/validateReferencedIds';

export class EditWorldMasterUseCase implements IEditWorldMasterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditWorldMasterService,
        private readonly worldMasterRepository: IWorldMasterRepository,
        private readonly assistantRepository: IAssistantRepository
    ) { }

    async execute (params: EditWorldMasterParams): Promise<EditWorldMasterReturn> {
        this.logger.info('Executing EditWorldMasterUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                worldMaster: undefined,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                worldMaster: undefined,
                error: missingIdError
            };
        }

        const { id, name, activationWord, prompt, observation, assistantId, createdAt } = params;

        this.logger.debug('Calling EditWorldMasterService', { id, name, activationWord, prompt, observation, assistantId, createdAt });
        const response = this.service.editWorldMaster({ id, name, activationWord, prompt, observation, assistantId, createdAt });
        this.logger.debug('EditWorldMasterService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                worldMaster: undefined,
                error: response.error || 'An unknown error occurred on EditWorldMasterService'
            };
        }

        if (!response.worldMaster) {
            return {
                success: false,
                worldMaster: undefined,
                error: 'Success is true but does not have a worldMaster'
            };
        }

        const editedWorldMaster = response.worldMaster;
        const existingWorldMasters = await this.worldMasterRepository.getWorldMasters();
        const duplicateWorldMaster = existingWorldMasters.find(
            (wm) => wm.name === editedWorldMaster.name && wm.id !== editedWorldMaster.id
        );

        if (duplicateWorldMaster) {
            this.logger.warning(`World master with name ${editedWorldMaster.name} already exists`);
            return {
                success: false,
                worldMaster: undefined,
                error: `World master with name ${editedWorldMaster.name} already exists`
            };
        }

        const editResult = await this.worldMasterRepository.editWorldMaster({ worldMaster: editedWorldMaster });
        if (!editResult.success) {
            return {
                success: false,
                worldMaster: undefined,
                error: editResult.error || 'Failed to edit world master'
            };
        }

        return {
            worldMaster: editedWorldMaster,
            success: true
        };
    }

    private validate (params: EditWorldMasterParams): string | null {
        if (!params.id) {
            return 'An id is required to edit a world master';
        }

        if (!params.name?.trim()) {
            return 'A name is required to edit a world master';
        }

        if (!params.activationWord?.trim()) {
            return 'An activation word is required to edit a world master';
        }

        if (!params.prompt?.trim()) {
            return 'A prompt is required to edit a world master';
        }

        return null;
    }

    private async validateReferencedIds (params: EditWorldMasterParams): Promise<string | null> {
        return checkReferencedId(
            (id) => this.assistantRepository.getAssistantById(id),
            params.assistantId,
            'Assistant'
        );
    }
}
