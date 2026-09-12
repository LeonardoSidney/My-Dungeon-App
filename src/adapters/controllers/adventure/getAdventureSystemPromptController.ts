import { IGetAdventureSystemPromptController, GetAdventureSystemPromptControllerParams, GetAdventureSystemPromptControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureSystemPromptUseCase } from '@domain/use-cases';

export class GetAdventureSystemPromptController implements IGetAdventureSystemPromptController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureSystemPromptUseCase
    ) { }

    async handle (params: GetAdventureSystemPromptControllerParams): Promise<GetAdventureSystemPromptControllerResponse> {
        this.logger.info('Executing GetAdventureSystemPromptController::handle');
        this.logger.debug('GetAdventureSystemPromptController::handle - params', params);

        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            systemPrompt: response.systemPrompt,
            error: response.error
        };
    }
}
