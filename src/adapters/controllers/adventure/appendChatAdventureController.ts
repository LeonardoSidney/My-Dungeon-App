import {
    IAppendChatAdventureController,
    AppendChatControllerRequest,
    AppendChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IAppendChatAdventureUseCase } from '@domain/use-cases';

export class AppendChatAdventureController implements IAppendChatAdventureController {
    constructor (private readonly logger: ILogger, private readonly useCase: IAppendChatAdventureUseCase) {}

    async handle (request: AppendChatControllerRequest): Promise<AppendChatControllerResponse> {
        this.logger.info('Executing AppendChatAdventureController::handle');
        const { adventure, message } = request;

        const response = await this.useCase.execute({
            adventure,
            message,
        });

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
