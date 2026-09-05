import { Status } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditStatusServiceParams, EditStatusServiceReturn, IEditStatusService } from '@domain/services';

export class EditStatusService implements IEditStatusService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editStatus (params: EditStatusServiceParams): EditStatusServiceReturn {
        this.logger.info('Executing EditStatusService::editStatus');
        const { status, editParams } = params;

        const editedStatus: Status = {
            ...status,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            status: editedStatus
        };
    }
}
