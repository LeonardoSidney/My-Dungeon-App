import { GetChatTemplatesControllerResponse, IGetChatTemplatesController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetChatTemplatesUseCase } from '@domain/use-cases';

export class GetChatTemplatesController implements IGetChatTemplatesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetChatTemplatesUseCase
    ) { }

    async handle (): Promise<GetChatTemplatesControllerResponse> {
        this.logger.info('Executing GetChatTemplatesController::handle');
        return this.useCase.execute();
    }
}
