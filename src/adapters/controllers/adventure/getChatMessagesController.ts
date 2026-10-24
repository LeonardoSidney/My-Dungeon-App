import {
    GetChatMessagesControllerParams,
    GetChatMessagesControllerResponse,
    IGetChatMessagesController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IChatMessagesPresenter } from '@domain/presenters';
import { IGetChatMessagesUseCase } from '@domain/use-cases';

export class GetChatMessagesController implements IGetChatMessagesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetChatMessagesUseCase,
        private readonly presenter: IChatMessagesPresenter
    ) { }

    async handle (params: GetChatMessagesControllerParams): Promise<GetChatMessagesControllerResponse> {
        this.logger.info('Executing GetChatMessagesController::handle');
        this.logger.debug('GetChatMessagesController::handle - params', params);

        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            messages: response.chats && this.presenter.present(response.chats),
            error: response.error,
        };
    }
}
