import { CreateItemRequest, CreateItemResponse, ICreateItemController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateItemUseCase } from '@domain/use-cases';

export class CreateItemController implements ICreateItemController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateItemUseCase
    ) { }

    async handle (request: CreateItemRequest): Promise<CreateItemResponse> {
        this.logger.info('Executing CreateItemController::handle');
        const { name, activationWord, prompt, observation } = request;
        return this.useCase.execute({
            name,
            activationWord,
            prompt,
            observation
        });
    }
}
