import {
    ISaveSystemPromptLoadOrderController,
    SaveSystemPromptLoadOrderControllerRequest,
    SaveSystemPromptLoadOrderControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISaveSystemPromptLoadOrderUseCase } from '@domain/use-cases';

export class SaveSystemPromptLoadOrderController implements ISaveSystemPromptLoadOrderController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISaveSystemPromptLoadOrderUseCase
    ) { }

    async handle (request: SaveSystemPromptLoadOrderControllerRequest): Promise<SaveSystemPromptLoadOrderControllerResponse> {
        this.logger.info('Executing SaveSystemPromptLoadOrderController::handle');
        this.logger.debug('SaveSystemPromptLoadOrderController::handle - params', request);
        return this.useCase.execute(request);
    }
}
