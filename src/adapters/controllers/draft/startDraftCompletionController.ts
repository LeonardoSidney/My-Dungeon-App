import {
    IStartDraftCompletionController,
    StartDraftCompletionControllerRequest,
    StartDraftCompletionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IStartDraftCompletionUseCase } from '@domain/use-cases';

export class StartDraftCompletionController implements IStartDraftCompletionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IStartDraftCompletionUseCase
    ) { }

    async handle (request: StartDraftCompletionControllerRequest): Promise<StartDraftCompletionControllerResponse> {
        this.logger.info('Executing StartDraftCompletionController::handle');
        this.logger.debug('StartDraftCompletionController::handle - params', { draftId: request.draftId });

        return this.useCase.execute(request);
    }
}
