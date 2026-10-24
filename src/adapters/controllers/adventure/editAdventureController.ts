import {
    EditAdventureControllerParams,
    EditAdventureControllerResponse,
    IEditAdventureController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditAdventureUseCase } from '@domain/use-cases';

export class EditAdventureController implements IEditAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditAdventureUseCase
    ) { }

    async handle (params: EditAdventureControllerParams): Promise<EditAdventureControllerResponse> {
        this.logger.info('Executing EditAdventureController::handle');
        this.logger.debug('EditAdventureController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            id: response.id,
            error: response.error
        };
    }
}
