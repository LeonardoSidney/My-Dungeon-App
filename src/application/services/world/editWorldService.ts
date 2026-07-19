import { ILogger } from '@domain/logger';
import { EditWorldServiceParams, EditWorldServiceReturn, IEditWorldService } from '@domain/services';

export class EditWorldService implements IEditWorldService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editWorld (params: EditWorldServiceParams): EditWorldServiceReturn {
        this.logger.info('Executing EditWorldService::editWorld');
        const { id, name, activationWord, prompt, observation, createdAt } = params;

        const world = {
            id,
            name,
            activationWord,
            prompt,
            observation,
            createdAt: createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            world
        };
    }
}
