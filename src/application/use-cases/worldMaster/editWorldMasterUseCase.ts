import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IWorldMasterRepository,
} from '@domain/repository';
import { IEditWorldMasterService, WorldMasterEditParams } from '@domain/services';
import { EditWorldMasterParams, EditWorldMasterReturn, IEditWorldMasterUseCase } from '@domain/use-cases';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
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
                error: validationError
            };
        }
        const { id, editParams } = params;
        const worldMasterResponse = await this.worldMasterRepository.getWorldMasterById(id);
        if (!worldMasterResponse.success) {
            this.logger.warning('EditWorldMasterUseCase::execute - failed to load world master', worldMasterResponse.error);
            return { success: false, error: worldMasterResponse.error };
        }

        const worldMaster = worldMasterResponse.worldMaster;
        if (!worldMaster) {
            return {
                success: false,
                error: `World master with id ${id} not found`
            };
        }
        const missingIdError = await this.validateReferencedIds(editParams);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        this.logger.debug('Calling EditWorldMasterService', { id, editParams });
        const response = this.service.editWorldMaster({ worldMaster, editParams });
        this.logger.debug('EditWorldMasterService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditWorldMasterService'
            };
        }

        if (!response.worldMaster) {
            return {
                success: false,
                error: 'Success is true but does not have a worldMaster'
            };
        }

        const editedWorldMaster = response.worldMaster;
        const existingWorldMastersResponse = await this.worldMasterRepository.getWorldMasters();
        if (!existingWorldMastersResponse.success || !existingWorldMastersResponse.worldMasters) {
            this.logger.warning('EditWorldMasterUseCase::execute - failed to load world masters', existingWorldMastersResponse.error);
            return { success: false, error: existingWorldMastersResponse.error };
        }

        const existingWorldMasters = existingWorldMastersResponse.worldMasters;
        const duplicateWorldMaster = existingWorldMasters.find(
            (wm) => wm.name === editedWorldMaster.name && wm.id !== editedWorldMaster.id
        );

        if (duplicateWorldMaster) {
            this.logger.warning(`World master with name ${editedWorldMaster.name} already exists`);
            return {
                success: false,
                error: `World master with name ${editedWorldMaster.name} already exists`
            };
        }

        const editResult = await this.worldMasterRepository.editWorldMaster({ worldMaster: editedWorldMaster });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit world master'
            };
        }

        return {
            id: editedWorldMaster.id,
            success: true
        };
    }

    private validate (params: EditWorldMasterParams): string | null {
        if (!params.id) {
            return 'An id is required to edit a world master';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a world master';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit a world master';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit a world master';
        }

        return null;
    }

    private async validateReferencedIds (editParams: WorldMasterEditParams): Promise<string | null> {
        return checkReferencedId(
            (id: string) => this.assistantRepository.getAssistantById(id),
            REFERENCED_ENTITIES.ASSISTANT,
            editParams.assistantId
        );
    }
}
