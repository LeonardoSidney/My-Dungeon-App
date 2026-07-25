import { ILogger } from '@domain/logger';
import { EditStatusServiceParams, EditStatusServiceReturn, IEditStatusService } from '@domain/services';

export class EditStatusService implements IEditStatusService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editStatus (params: EditStatusServiceParams): EditStatusServiceReturn {
        this.logger.info('EditStatusService::editStatus');

        const { status } = params;
        const updatedAt = new Date();

        return {
            success: true,
            status: {
                ...status,
                updatedAt
            }
        };
    }
}
