import {
    IStopChatReplyController,
    StopChatReplyControllerRequest,
    StopChatReplyControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IStopChatReplyUseCase } from '@domain/use-cases';

export class StopChatReplyController implements IStopChatReplyController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IStopChatReplyUseCase
    ) { }

    handle (request: StopChatReplyControllerRequest): StopChatReplyControllerResponse {
        this.logger.info('Executing StopChatReplyController::handle');
        this.logger.debug('StopChatReplyController::handle - params', request);

        return this.useCase.execute(request);
    }
}
