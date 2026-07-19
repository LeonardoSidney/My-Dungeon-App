import {
    EditWorldControllerRequest,
    EditWorldControllerResponse,
    IEditWorldController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditWorldUseCase } from '@domain/use-cases';

export class EditWorldController implements IEditWorldController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditWorldUseCase
    ) { }

    async handle (request: EditWorldControllerRequest): Promise<EditWorldControllerResponse> {
        this.logger.info('Executing EditWorldController::handle');
        const { id, name, activationWord, prompt, observation, createdAt } = request;
        const response = await this.useCase.execute({
            id,
            name,
            activationWord,
            prompt,
            observation,
            createdAt
        });

        return {
            success: response.success,
            world: response.world,
            error: response.error
        };
    }
}
