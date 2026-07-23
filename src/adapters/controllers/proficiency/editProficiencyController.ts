import {
    EditProficiencyControllerParams,
    EditProficiencyControllerResponse,
    IEditProficiencyController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditProficiencyUseCase } from '@domain/use-cases';

export class EditProficiencyController implements IEditProficiencyController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditProficiencyUseCase
    ) { }
    async handle (params: EditProficiencyControllerParams): Promise<EditProficiencyControllerResponse> {
        this.logger.info('Executing EditProficiencyController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            proficiency: response.proficiency,
            error: response.error
        };
    }
}
