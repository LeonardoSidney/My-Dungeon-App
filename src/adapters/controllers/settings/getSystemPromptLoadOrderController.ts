import { GetSystemPromptLoadOrderControllerResponse, IGetSystemPromptLoadOrderController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetSystemPromptLoadOrderUseCase } from '@domain/use-cases';

export class GetSystemPromptLoadOrderController implements IGetSystemPromptLoadOrderController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetSystemPromptLoadOrderUseCase
    ) { }

    async handle (): Promise<GetSystemPromptLoadOrderControllerResponse> {
        this.logger.info('Executing GetSystemPromptLoadOrderController::handle');
        return this.useCase.execute();
    }
}
