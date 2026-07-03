import { IGetConnectionsController } from '@domain/controllers';
import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetConnectionsUseCase } from '@domain/use-cases';

export class GetConnectionsController implements IGetConnectionsController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetConnectionsUseCase
    ) { }
    async handle(): Promise<Connection[]> {
        this.logger.info('Executing GetConnectionsController::handle');
        return this.useCase.execute();
    }
}
