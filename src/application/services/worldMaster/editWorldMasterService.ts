import { ILogger } from '@domain/logger';
import { EditWorldMasterServiceParams, EditWorldMasterServiceReturn, IEditWorldMasterService } from '@domain/services';

export class EditWorldMasterService implements IEditWorldMasterService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editWorldMaster (params: EditWorldMasterServiceParams): EditWorldMasterServiceReturn {
        this.logger.info('Executing EditWorldMasterService::editWorldMaster');
        const { id, name, activationWord, prompt, observation, assistant, createdAt } = params;

        const worldMaster = {
            id,
            name,
            activationWord,
            prompt,
            observation,
            assistant,
            createdAt: createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            worldMaster
        };
    }
}
