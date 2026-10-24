import {
    IStopDraftCompletionController,
    StopDraftCompletionControllerRequest,
    StopDraftCompletionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IStopDraftCompletionUseCase } from '@domain/use-cases';

export class StopDraftCompletionController implements IStopDraftCompletionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IStopDraftCompletionUseCase
    ) { }

    handle (request: StopDraftCompletionControllerRequest): StopDraftCompletionControllerResponse {
        this.logger.info('Executing StopDraftCompletionController::handle');
        this.logger.debug('StopDraftCompletionController::handle - params', request);

        return this.useCase.execute(request);
    }
}
