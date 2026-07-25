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
        this.validate(params);

        const { status } = params;

        this.logger.debug('Calling EditStatusService', status);
        const response = this.service.editStatus({ status });
        this.logger.debug('EditStatusService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                status: undefined,
                error: response.error || 'An unknown error occurred on EditStatusService'
            };
        }

        if (!response.status) {
            return {
                success: false,
                status: undefined,
                error: 'Success is true but does not have a status'
            };
        }

        const editedStatus = response.status;
        const existingStatuses = await this.statusRepository.getStatuses();
        const duplicateStatus = existingStatuses.find(
            (s) => s.name === editedStatus.name && s.id !== editedStatus.id
        );

        if (duplicateStatus) {
            this.logger.warning(`Status with name ${editedStatus.name} already exists`);
            return {
                success: false,
                status: undefined,
                error: `Status with name ${editedStatus.name} already exists`
            };
        }

        const editResult = await this.statusRepository.editStatus({ status: editedStatus });
        if (!editResult.success) {
            return {
                success: false,
                status: undefined,
                error: editResult.error || 'Failed to edit status'
            };
        }

        return {
            status: editedStatus,
            success: true
        };
    }

    private validate (params: EditStatusParams): void {
        const { status } = params;

        if (!status.id) {
            throw new Error('An id is required to edit a status');
        }

        if (!status.name?.trim()) {
            throw new Error('A name is required to edit a status');
        }

        if (!status.activationWord?.trim()) {
            throw new Error('An activation word is required to edit a status');
        }

        if (!status.prompt?.trim()) {
            throw new Error('A prompt is required to edit a status');
        }
    }
}
