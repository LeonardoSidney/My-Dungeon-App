import { EraseWorldControllerResponse, IEraseWorldController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseWorldUseCase, EraseWorldUseCaseReturn } from '@domain/use-cases';

export class EraseWorldController implements IEraseWorldController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseWorldUseCase
    ) { }

    async handle (worldId: string): Promise<EraseWorldControllerResponse> {
        this.logger.info('Executing EraseWorldController::handle');
        const result: EraseWorldUseCaseReturn = await this.useCase.execute(worldId);
        return { success: result.success, error: result.error };
    }
}
