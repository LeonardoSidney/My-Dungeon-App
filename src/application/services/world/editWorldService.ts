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
            name: editParams.name.trim(),
            activationWord: editParams.activationWord,
            prompt: editParams.prompt,
            observation: editParams.observation,
            updatedAt: new Date()
        };

        return {
            success: true,
            world: editedWorld
        };
    }
}
