import {
    GetChatMessageControllerParams,
    GetChatMessageControllerResponse,
    IGetChatMessageController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IChatMessagesPresenter } from '@domain/presenters';
import { IGetChatByIdUseCase } from '@domain/use-cases';

export class GetChatMessageController implements IGetChatMessageController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetChatByIdUseCase,
        private readonly presenter: IChatMessagesPresenter
    ) { }

    async handle (params: GetChatMessageControllerParams): Promise<GetChatMessageControllerResponse> {
        this.logger.info('Executing GetChatMessageController::handle');
        this.logger.debug('GetChatMessageController::handle - params', params);

        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            message: response.chat && this.presenter.presentOne(response.chat),
            error: response.error,
        };
    }
}
