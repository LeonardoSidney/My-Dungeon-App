import { Proficiency } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditProficiencyServiceParams, EditProficiencyServiceReturn, IEditProficiencyService } from '@domain/services';

export class EditProficiencyService implements IEditProficiencyService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editProficiency (params: EditProficiencyServiceParams): EditProficiencyServiceReturn {
        this.logger.info('Executing EditProficiencyService::editProficiency');
        const { proficiency, editParams } = params;

        const editedProficiency: Proficiency = {
            ...proficiency,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            proficiency: editedProficiency
        };
    }
}
