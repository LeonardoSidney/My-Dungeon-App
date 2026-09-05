import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditWorldMasterServiceParams, EditWorldMasterServiceReturn, IEditWorldMasterService } from '@domain/services';

export class EditWorldMasterService implements IEditWorldMasterService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editWorldMaster (params: EditWorldMasterServiceParams): EditWorldMasterServiceReturn {
        this.logger.info('Executing EditWorldMasterService::editWorldMaster');
        const { worldMaster, editParams } = params;

        const editedWorldMaster: WorldMaster = {
            ...worldMaster,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            worldMaster: editedWorldMaster
        };
    }
}
