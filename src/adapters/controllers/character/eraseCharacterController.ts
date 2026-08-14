import { EraseCharacterControllerResponse, IEraseCharacterController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseCharacterUseCase, EraseCharacterReturn } from '@domain/use-cases';

export class EraseCharacterController implements IEraseCharacterController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseCharacterUseCase
    ) { }

    async handle (characterId: string): Promise<EraseCharacterControllerResponse> {
        this.logger.info('Executing EraseCharacterController::handle');
        const result: EraseCharacterReturn = await this.useCase.execute(characterId);
        return { success: result.success, error: result.error };
    }
}
