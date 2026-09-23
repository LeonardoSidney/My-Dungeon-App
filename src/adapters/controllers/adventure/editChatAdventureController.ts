import {
    IEditChatAdventureController,
    EditChatControllerRequest,
    EditChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditChatAdventureUseCase } from '@domain/use-cases';

export class EditChatAdventureController implements IEditChatAdventureController {
    constructor (
    private readonly logger: ILogger,
    private readonly useCase: IEditChatAdventureUseCase
    ) { }

    async handle (request: EditChatControllerRequest): Promise<EditChatControllerResponse> {
        this.logger.info('Executing EditChatAdventureController::handle');
        this.logger.debug('EditChatAdventureController::handle - request', {
            chatId: request.chatId,
            role: request.role,
            characterId: request.characterId,
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
