import { AlertControllerParams, IAlertController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IAlertUseCase } from '@domain/use-cases';

export class AlertController implements IAlertController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IAlertUseCase
    ) { }

    async handle (params: AlertControllerParams): Promise<void> {
        this.logger.info('Executing AlertController::handle');
        this.useCase.execute(params);
    }
}
