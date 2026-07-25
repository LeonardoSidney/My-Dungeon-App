import { ILogger } from '@domain/logger';
import { EditAbilityServiceParams, EditAbilityServiceReturn, IEditAbilityService } from '@domain/services';

export class EditAbilityService implements IEditAbilityService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editAbility (params: EditAbilityServiceParams): EditAbilityServiceReturn {
        this.logger.info('EditAbilityService::editAbility');

        const { ability } = params;
        const updatedAt = new Date();

        return {
            success: true,
            ability: {
                ...ability,
                updatedAt
            }
        };
    }
}
