import {
    ISaveChatTemplatesController,
    SaveChatTemplatesControllerRequest,
    SaveChatTemplatesControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISaveChatTemplatesUseCase } from '@domain/use-cases';

export class SaveChatTemplatesController implements ISaveChatTemplatesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISaveChatTemplatesUseCase
    ) { }

    async handle (request: SaveChatTemplatesControllerRequest): Promise<SaveChatTemplatesControllerResponse> {
        this.logger.info('Executing SaveChatTemplatesController::handle');
        this.logger.debug('SaveChatTemplatesController::handle - params', request);
        return this.useCase.execute(request);
    }
}
