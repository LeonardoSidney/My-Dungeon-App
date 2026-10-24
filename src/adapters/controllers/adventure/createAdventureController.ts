import { CreateAdventureRequest, CreateAdventureResponse, ICreateAdventureController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateAdventureUseCase } from '@domain/use-cases';

export class CreateAdventureController implements ICreateAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateAdventureUseCase
    ) { }

    async handle (request: CreateAdventureRequest): Promise<CreateAdventureResponse> {
        this.logger.info('Executing CreateAdventureController::handle');
        this.logger.debug('CreateAdventureController::handle - params', request);
        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            id: response.id,
            error: response.error
        };
    }
}
