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
        const { name, activationWord, prompt, observation } = request;
        return this.useCase.execute({
            name,
            activationWord,
            prompt,
            observation
        });
    }
}
