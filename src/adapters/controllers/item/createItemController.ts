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
        this.logger.debug('CreateItemController::handle - params', request);
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
