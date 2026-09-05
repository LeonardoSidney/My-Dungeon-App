import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditLocationServiceParams, EditLocationServiceReturn, IEditLocationService } from '@domain/services';

export class EditLocationService implements IEditLocationService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editLocation (params: EditLocationServiceParams): EditLocationServiceReturn {
        this.logger.info('Executing EditLocationService::editLocation');
        const { location, editParams } = params;

        const editedLocation: Location = {
            ...location,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            location: editedLocation
        };
    }
}
