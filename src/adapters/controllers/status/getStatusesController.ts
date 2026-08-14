import { IGetStatusesController } from '@domain/controllers';
import { Status } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetStatusesUseCase } from '@domain/use-cases';

export class GetStatusesController implements IGetStatusesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetStatusesUseCase
    ) { }

    async handle (): Promise<Status[]> {
        this.logger.info('Executing GetStatusesController::handle');
        return await this.useCase.execute();
    }
}
