import { CreateLocationRequest, CreateLocationResponse, ICreateLocationController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateLocationUseCase } from '@domain/use-cases';

export class CreateLocationController implements ICreateLocationController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateLocationUseCase
    ) { }

    async handle (request: CreateLocationRequest): Promise<CreateLocationResponse> {
        this.logger.info('Executing CreateLocationController::handle');
        this.logger.debug('CreateLocationController::handle - params', request);
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
