import { IGetWorldsController } from '@domain/controllers';
import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetWorldsUseCase } from '@domain/use-cases';

export class GetWorldsController implements IGetWorldsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetWorldsUseCase
    ) { }

    async handle (): Promise<World[]> {
        this.logger.info('Executing GetWorldsController::handle');
        return this.useCase.execute();
    }
}
