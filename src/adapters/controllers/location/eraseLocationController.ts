import { EraseLocationControllerResponse, IEraseLocationController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseLocationUseCase, EraseLocationUseCaseReturn } from '@domain/use-cases';

export class EraseLocationController implements IEraseLocationController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEraseLocationUseCase
    ) { }

    async handle (locationId: string): Promise<EraseLocationControllerResponse> {
        this.logger.info('Executing EraseLocationController::handle');
        const result: EraseLocationUseCaseReturn = await this.useCase.execute(locationId);
        return { success: result.success, error: result.error };
    }
}
