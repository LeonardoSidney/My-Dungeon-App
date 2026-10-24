import {
    IRegenerateFromChatController,
    RegenerateFromChatControllerRequest,
    RegenerateFromChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IRegenerateFromChatUseCase } from '@domain/use-cases';

export class RegenerateFromChatController implements IRegenerateFromChatController {
    constructor (
    private readonly logger: ILogger,
    private readonly useCase: IRegenerateFromChatUseCase
    ) { }

    async handle (request: RegenerateFromChatControllerRequest): Promise<RegenerateFromChatControllerResponse> {
        this.logger.info('Executing RegenerateFromChatController::handle');
        this.logger.debug('RegenerateFromChatController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            replyChatId: response.replyChatId,
            error: response.error,
        };
    }
}
