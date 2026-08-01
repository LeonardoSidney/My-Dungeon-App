import {
    EditSystemPromptControllerParams,
    EditSystemPromptControllerResponse,
    IEditSystemPromptController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditSystemPromptUseCase } from '@domain/use-cases';

export class EditSystemPromptController implements IEditSystemPromptController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditSystemPromptUseCase
    ) { }
    async handle (params: EditSystemPromptControllerParams): Promise<EditSystemPromptControllerResponse> {
        this.logger.info('Executing EditSystemPromptController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            systemPrompt: response.systemPrompt,
            error: response.error
        };
    }
}
