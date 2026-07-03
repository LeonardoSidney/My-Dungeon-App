import { IGetAbilitiesController } from '@domain/controllers';
import { Ability } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetAbilitiesUseCase } from '@domain/use-cases';

export class GetAbilitiesController implements IGetAbilitiesController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetAbilitiesUseCase
    ) { }

    async handle(): Promise<Ability[]> {
        this.logger.info('Executing GetAbilitiesController::handle');
        return await this.useCase.execute();
    }
}
