import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import { IEditStatusService } from '@domain/services';
import { EditStatusParams, EditStatusReturn, IEditStatusUseCase } from '@domain/use-cases';

export class EditStatusUseCase implements IEditStatusUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditStatusService,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (params: EditStatusParams): Promise<EditStatusReturn> {
        this.logger.info('Executing EditStatusUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const statusResponse = await this.statusRepository.getStatusById(id);
        if (!statusResponse.success) {
            this.logger.warning('EditStatusUseCase::execute - failed to load status', statusResponse.error);
            return { success: false, error: statusResponse.error };
        }

        const status = statusResponse.status;
        if (!status) {
            return {
                success: false,
                error: `Status with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditStatusService', { id, editParams });
        const response = this.service.editStatus({ status, editParams });
        this.logger.debug('EditStatusService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditStatusService'
            };
        }

        if (!response.status) {
            return {
                success: false,
                error: 'Success is true but does not have a status'
            };
        }

        const editedStatus = response.status;
        const existingStatusesResponse = await this.statusRepository.getStatuses();
        if (!existingStatusesResponse.success || !existingStatusesResponse.statuses) {
            this.logger.warning('EditStatusUseCase::execute - failed to load statuses', existingStatusesResponse.error);
            return { success: false, error: existingStatusesResponse.error };
        }

        const existingStatuses = existingStatusesResponse.statuses;
        const duplicateStatus = existingStatuses.find(
            (s) => s.name === editedStatus.name && s.id !== editedStatus.id
        );

        if (duplicateStatus) {
            this.logger.warning(`Status with name ${editedStatus.name} already exists`);
            return {
                success: false,
                error: `Status with name ${editedStatus.name} already exists`
            };
        }

        const editResult = await this.statusRepository.editStatus({ status: editedStatus });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit status'
            };
        }

        return {
            id: editedStatus.id,
            success: true
        };
    }

    private validate (params: EditStatusParams): string | null {
        if (!params.id) {
            return 'An id is required to edit a status';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a status';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit a status';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit a status';
        }

        return null;
    }
}
