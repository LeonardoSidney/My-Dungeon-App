import { EraseSystemPromptControllerResponse, IEraseSystemPromptController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseSystemPromptUseCase, EraseSystemPromptUseCaseReturn } from '@domain/use-cases';

export class EraseSystemPromptController implements IEraseSystemPromptController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseSystemPromptUseCase
    ) { }

    async handle (systemPromptId: string): Promise<EraseSystemPromptControllerResponse> {
        this.logger.info('Executing EraseSystemPromptController::handle');
        const result: EraseSystemPromptUseCaseReturn = await this.useCase.execute(systemPromptId);
        return { success: result.success, error: result.error };
    }
}
