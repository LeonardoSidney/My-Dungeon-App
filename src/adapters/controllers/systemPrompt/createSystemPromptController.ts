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
        const { name, content, observation } = request;
        return this.useCase.execute({
            name,
            content,
            observation
        });
    }
}
