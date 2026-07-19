import {
    EditSamplerControllerParams,
    EditSamplerControllerResponse,
    IEditSamplerController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditSamplerUseCase } from '@domain/use-cases';

export class EditSamplerController implements IEditSamplerController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditSamplerUseCase
    ) { }
    async handle (params: EditSamplerControllerParams): Promise<EditSamplerControllerResponse> {
        this.logger.info('Executing EditSamplerController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            sampler: response.sampler,
            error: response.error
        };
    }
}
