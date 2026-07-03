import { IGetSystemPromptsController } from '@domain/controllers';
import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetSystemPromptsUseCase } from '@domain/use-cases';

export class GetSystemPromptsController implements IGetSystemPromptsController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetSystemPromptsUseCase
    ) { }

    async handle(): Promise<SystemPrompt[]> {
        this.logger.info('Executing GetSystemPromptsController::handle');
        return this.useCase.execute();
    }
}
