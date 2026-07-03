import { IAdventureAppendChatController, AppendChatControllerRequest, AppendChatControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IAdventureAppendChatUseCase } from '@domain/use-cases';

export class AdventureAppendChatController implements IAdventureAppendChatController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IAdventureAppendChatUseCase
    ) { }

    async handle(request: AppendChatControllerRequest): Promise<AppendChatControllerResponse> {
        this.logger.info('Executing AdventureAppendChatController::handle');
        const { adventure, message } = request;

        const response = await this.useCase.execute({
            adventure,
            message
        });

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error
        };
    }
}
