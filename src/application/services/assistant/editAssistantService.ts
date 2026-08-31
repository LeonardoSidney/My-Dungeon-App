import { ILogger } from '@domain/logger';
import { EditAssistantServiceParams, EditAssistantServiceReturn, IEditAssistantService } from '@domain/services';

export class EditAssistantService implements IEditAssistantService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAssistant (params: EditAssistantServiceParams): EditAssistantServiceReturn {
        this.logger.info('Executing EditAssistantService::editAssistant');
        const { id, name, observation, modelId, samplerId, connectionId, createdAt } = params;

        const assistant = {
            id,
            name,
            observation,
            modelId,
            samplerId,
            connectionId,
            createdAt: createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            assistant
        };
    }
}
