import { Assistant } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAssistantServiceParams, EditAssistantServiceReturn, IEditAssistantService } from '@domain/services';

export class EditAssistantService implements IEditAssistantService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAssistant (params: EditAssistantServiceParams): EditAssistantServiceReturn {
        this.logger.info('Executing EditAssistantService::editAssistant');
        const { assistant, editParams } = params;

        const editedAssistant: Assistant = {
            ...assistant,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            assistant: editedAssistant
        };
    }
}
