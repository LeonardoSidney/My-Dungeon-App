import { IGetCharactersController } from '@domain/controllers';
import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetCharactersUseCase } from '@domain/use-cases';

export class GetCharactersController implements IGetCharactersController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetCharactersUseCase
    ) { }

    async handle(): Promise<Character[]> {
        this.logger.info('Executing GetCharactersController::handle');
        return this.useCase.execute();
    }
}
