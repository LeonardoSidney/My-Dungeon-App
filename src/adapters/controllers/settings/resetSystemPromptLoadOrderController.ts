import { IResetSystemPromptLoadOrderController, ResetSystemPromptLoadOrderControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IResetSystemPromptLoadOrderUseCase } from '@domain/use-cases';

export class ResetSystemPromptLoadOrderController implements IResetSystemPromptLoadOrderController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IResetSystemPromptLoadOrderUseCase
    ) { }

    async handle (): Promise<ResetSystemPromptLoadOrderControllerResponse> {
        this.logger.info('Executing ResetSystemPromptLoadOrderController::handle');
        return this.useCase.execute();
    }
}
