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
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            item: response.item,
            error: response.error
        };
    }
}
