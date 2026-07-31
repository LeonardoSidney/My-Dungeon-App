import {
    ICreateChatAdventureController,
    CreateChatAdventureControllerRequest,
    CreateChatAdventureControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateChatAdventureUseCase } from '@domain/use-cases';

export class CreateChatAdventureController implements ICreateChatAdventureController {
    constructor(private readonly logger: ILogger, private readonly useCase: ICreateChatAdventureUseCase) {}

    async handle(request: CreateChatAdventureControllerRequest): Promise<CreateChatAdventureControllerResponse> {
        this.logger.info('Executing CreateChatAdventureController::handle');
        this.logger.debug('CreateChatAdventureController::handle - request', request);

        const response = await this.useCase.execute({
            content: request.content,
            role: request.role,
            think: request.think,
            characterName: request.characterName,
        });

        return {
            success: response.success,
            chat: response.chat,
            error: response.error,
        };
    }
}
