import { EraseSystemPromptControllerResponse, IEraseSystemPromptController, EraseSystemPromptControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseSystemPromptUseCase, EraseSystemPromptUseCaseReturn } from '@domain/use-cases';

export class EraseSystemPromptController implements IEraseSystemPromptController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseSystemPromptUseCase
    ) { }

    async handle (request: EraseSystemPromptControllerRequest): Promise<EraseSystemPromptControllerResponse> {
        this.logger.info('Executing EraseSystemPromptController::handle');
        this.logger.debug('EraseSystemPromptController::handle - params', request);
        const result: EraseSystemPromptUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
