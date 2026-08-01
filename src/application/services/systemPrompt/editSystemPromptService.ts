import { ILogger } from '@domain/logger';
import {
    EditSystemPromptServiceParams,
    EditSystemPromptServiceReturn,
    IEditSystemPromptService,
} from '@domain/services';

export class EditSystemPromptService implements IEditSystemPromptService {
    constructor(private readonly logger: ILogger) {}

    editSystemPrompt(params: EditSystemPromptServiceParams): EditSystemPromptServiceReturn {
        this.logger.info('EditSystemPromptService::editSystemPrompt');

        const { systemPrompt } = params;
        const updatedAt = new Date();

        return {
            success: true,
            systemPrompt: {
                ...systemPrompt,
                updatedAt,
            },
        };
    }
}
