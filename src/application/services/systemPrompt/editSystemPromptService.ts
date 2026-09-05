import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    EditSystemPromptServiceParams,
    EditSystemPromptServiceReturn,
    IEditSystemPromptService,
} from '@domain/services';

export class EditSystemPromptService implements IEditSystemPromptService {
    constructor (private readonly logger: ILogger) {}

    editSystemPrompt (params: EditSystemPromptServiceParams): EditSystemPromptServiceReturn {
        this.logger.info('Executing EditSystemPromptService::editSystemPrompt');
        const { systemPrompt, editParams } = params;

        const editedSystemPrompt: SystemPrompt = {
            ...systemPrompt,
            ...editParams,
            updatedAt: new Date(),
        };

        return {
            success: true,
            systemPrompt: editedSystemPrompt,
        };
    }
}
