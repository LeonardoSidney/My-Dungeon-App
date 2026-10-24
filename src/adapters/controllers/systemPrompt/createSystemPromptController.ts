import { CreateSystemPromptRequest, CreateSystemPromptResponse, ICreateSystemPromptController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateSystemPromptUseCase } from '@domain/use-cases';

export class CreateSystemPromptController implements ICreateSystemPromptController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateSystemPromptUseCase
    ) { }

    async handle (request: CreateSystemPromptRequest): Promise<CreateSystemPromptResponse> {
        this.logger.info('Executing CreateSystemPromptController::handle');
        this.logger.debug('CreateSystemPromptController::handle - params', request);
        const { name, content, observation } = request;
        const response = await this.useCase.execute({
            name,
            content,
            observation
        });

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
