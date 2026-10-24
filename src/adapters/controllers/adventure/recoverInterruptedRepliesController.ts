import { IRecoverInterruptedRepliesController, RecoverInterruptedRepliesControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IRecoverInterruptedRepliesUseCase } from '@domain/use-cases';

export class RecoverInterruptedRepliesController implements IRecoverInterruptedRepliesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IRecoverInterruptedRepliesUseCase
    ) { }

    async handle (): Promise<RecoverInterruptedRepliesControllerResponse> {
        this.logger.info('Executing RecoverInterruptedRepliesController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            error: response.error,
        };
    }
}
