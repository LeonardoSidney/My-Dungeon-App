import { CreateWorldRequest, CreateWorldResponse, ICreateWorldController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateWorldUseCase } from '@domain/use-cases';

export class CreateWorldController implements ICreateWorldController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateWorldUseCase
    ) { }

    async handle (request: CreateWorldRequest): Promise<CreateWorldResponse> {
        this.logger.info('Executing CreateWorldController::handle');
        this.logger.debug('CreateWorldController::handle - params', request);
        const { name, activationWord, prompt, observation } = request;
        const response = await this.useCase.execute({
            name,
            activationWord,
            prompt,
            observation
        });

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
