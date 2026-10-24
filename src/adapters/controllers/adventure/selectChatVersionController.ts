import {
    ISelectChatVersionController,
    SelectChatVersionControllerParams,
    SelectChatVersionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISelectChatVersionUseCase } from '@domain/use-cases';

export class SelectChatVersionController implements ISelectChatVersionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISelectChatVersionUseCase
    ) { }

    async handle (params: SelectChatVersionControllerParams): Promise<SelectChatVersionControllerResponse> {
        this.logger.info('Executing SelectChatVersionController::handle');
        this.logger.debug('SelectChatVersionController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
