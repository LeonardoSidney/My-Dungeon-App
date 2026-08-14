import { IGetLocationsController } from '@domain/controllers';
import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetLocationsUseCase } from '@domain/use-cases';

export class GetLocationsController implements IGetLocationsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetLocationsUseCase
    ) { }

    async handle (): Promise<Location[]> {
        this.logger.info('Executing GetLocationsController::handle');
        return this.useCase.execute();
    }
}
