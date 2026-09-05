import {
    EditWorldControllerParams,
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

    async handle (params: EditWorldControllerParams): Promise<EditWorldControllerResponse> {
        this.logger.info('Executing EditWorldController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            world: response.world,
            error: response.error
        };
    }
}
