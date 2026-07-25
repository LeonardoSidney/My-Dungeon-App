import {
    EditAbilityControllerParams,
    EditAbilityControllerResponse,
    IEditAbilityController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditAbilityUseCase } from '@domain/use-cases';

export class EditAbilityController implements IEditAbilityController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditAbilityUseCase
    ) { }
    async handle (params: EditAbilityControllerParams): Promise<EditAbilityControllerResponse> {
        this.logger.info('Executing EditAbilityController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            ability: response.ability,
            error: response.error
        };
    }
}
