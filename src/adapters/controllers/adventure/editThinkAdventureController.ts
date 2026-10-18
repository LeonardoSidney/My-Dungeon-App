import {
    IEditThinkAdventureController,
    EditThinkControllerRequest,
    EditThinkControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditThinkAdventureUseCase } from '@domain/use-cases';

export class EditThinkAdventureController implements IEditThinkAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditThinkAdventureUseCase
    ) { }

    async handle (request: EditThinkControllerRequest): Promise<EditThinkControllerResponse> {
        this.logger.info('Executing EditThinkAdventureController::handle');
        this.logger.debug('EditThinkAdventureController::handle - request', {
            chatId: request.chatId,
        });

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            chat: response.chat,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
