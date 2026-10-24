import {
    ISubscribeDraftController,
    SubscribeDraftControllerRequest,
    SubscribeDraftControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { DraftStatusEnum } from '@domain/providers';
import { ISubscribeDraftUseCase } from '@domain/use-cases';

export class SubscribeDraftController implements ISubscribeDraftController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISubscribeDraftUseCase
    ) { }

    handle (request: SubscribeDraftControllerRequest): SubscribeDraftControllerResponse {
        this.logger.info('Executing SubscribeDraftController::handle');
        this.logger.debug('SubscribeDraftController::handle - params', { draftId: request.draftId });

        const response = this.useCase.execute({
            draftId: request.draftId,
            listener: event => request.onUpdate({
                isStreaming: event.status === DraftStatusEnum.STREAMING,
                error: event.error,
            }),
        });

        return {
            success: response.success,
            isStreaming: response.isStreaming,
            unsubscribe: response.unsubscribe,
            error: response.error,
        };
    }
}
