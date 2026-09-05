import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditWorldServiceParams, EditWorldServiceReturn, IEditWorldService } from '@domain/services';

export class EditWorldService implements IEditWorldService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editWorld (params: EditWorldServiceParams): EditWorldServiceReturn {
        this.logger.info('Executing EditWorldService::editWorld');
        const { world, editParams } = params;

        const editedWorld: World = {
            ...world,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            world: editedWorld
        };
    }
}
