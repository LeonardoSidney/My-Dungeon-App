import { EraseConnectionControllerResponse, IEraseConnectionController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseConnectionUseCase, EraseConnectionUseCaseReturn } from '@domain/use-cases';

export class EraseConnectionController implements IEraseConnectionController {
    constructor(
        private logger: ILogger,
        private useCase: IEraseConnectionUseCase
    ) { }

    async handle(connectionId: string): Promise<EraseConnectionControllerResponse> {
        this.logger.info('Executing EraseConnectionController::handle');
        const result: EraseConnectionUseCaseReturn = await this.useCase.execute(connectionId);
        return { success: result.success, error: result.error };
    }
}
