import {
    EditItemControllerParams,
    EditItemControllerResponse,
    IEditItemController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditItemUseCase } from '@domain/use-cases';

export class EditItemController implements IEditItemController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditItemUseCase
    ) { }

    async handle (params: EditItemControllerParams): Promise<EditItemControllerResponse> {
        this.logger.info('Executing EditItemController::handle');
        this.logger.debug('EditItemController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
