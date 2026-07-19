import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import { IEditWorldMasterService } from '@domain/services';
import { EditWorldMasterParams, EditWorldMasterReturn, IEditWorldMasterUseCase } from '@domain/use-cases';

export class EditWorldMasterUseCase implements IEditWorldMasterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditWorldMasterService,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (params: EditWorldMasterParams): Promise<EditWorldMasterReturn> {
        this.logger.info('Executing EditWorldMasterUseCase::execute');
        this.validate(params);

        const { id, name, activationWord, prompt, observation, assistant, createdAt } = params;

        this.logger.debug('Calling EditWorldMasterService', { id, name, activationWord, prompt, observation, assistant, createdAt });
        const response = this.service.editWorldMaster({ id, name, activationWord, prompt, observation, assistant, createdAt });
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

    private validate (params: EditWorldMasterParams): void {
        if (!params.id) {
            throw new Error('An id is required to edit a world master');
        }

        if (!params.name?.trim()) {
            throw new Error('A name is required to edit a world master');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('An activation word is required to edit a world master');
        }

        if (!params.prompt?.trim()) {
            throw new Error('A prompt is required to edit a world master');
        }
    }
}
