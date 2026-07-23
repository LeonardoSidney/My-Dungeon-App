import { ILogger } from '@domain/logger';
import { EditProficiencyServiceParams, EditProficiencyServiceReturn, IEditProficiencyService } from '@domain/services';

export class EditProficiencyService implements IEditProficiencyService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editProficiency (params: EditProficiencyServiceParams): EditProficiencyServiceReturn {
        this.logger.info('EditProficiencyService::editProficiency');

        const { proficiency } = params;
        const updatedAt = new Date();

        return {
            success: true,
            proficiency: {
                ...proficiency,
                updatedAt
            }
        };
    }
}
