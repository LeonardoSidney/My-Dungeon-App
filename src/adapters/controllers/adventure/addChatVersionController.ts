import {
    IAddChatVersionController,
    AddChatVersionControllerRequest,
    AddChatVersionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IAddChatVersionUseCase } from '@domain/use-cases';

export class AddChatVersionController implements IAddChatVersionController {
    constructor (
    private readonly logger: ILogger,
    private readonly useCase: IAddChatVersionUseCase
    ) { }

    async handle (request: AddChatVersionControllerRequest): Promise<AddChatVersionControllerResponse> {
        this.logger.info('Executing AddChatVersionController::handle');
        this.logger.debug('AddChatVersionController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
