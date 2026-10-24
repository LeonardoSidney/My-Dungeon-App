import { EraseCharacterControllerResponse, IEraseCharacterController, EraseCharacterControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseCharacterUseCase, EraseCharacterReturn } from '@domain/use-cases';

export class EraseCharacterController implements IEraseCharacterController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseCharacterUseCase
    ) { }

    async handle (request: EraseCharacterControllerRequest): Promise<EraseCharacterControllerResponse> {
        this.logger.info('Executing EraseCharacterController::handle');
        this.logger.debug('EraseCharacterController::handle - params', request);
        const result: EraseCharacterReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
