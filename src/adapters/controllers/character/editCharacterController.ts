import {
    EditCharacterControllerRequest,
    EditCharacterControllerResponse,
    IEditCharacterController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditCharacterUseCase } from '@domain/use-cases';

export class EditCharacterController implements IEditCharacterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditCharacterUseCase
    ) { }

    async handle (request: EditCharacterControllerRequest): Promise<EditCharacterControllerResponse> {
        this.logger.info('Executing EditCharacterController::handle');
        const { character } = request;
        const response = await this.useCase.execute({
            character
        });

        return {
            success: response.success,
            character: response.character,
            error: response.error
        };
    }
}
