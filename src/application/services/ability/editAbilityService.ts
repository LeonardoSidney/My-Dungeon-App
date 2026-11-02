import { Ability } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAbilityServiceParams, EditAbilityServiceReturn, IEditAbilityService } from '@domain/services';

export class EditAbilityService implements IEditAbilityService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editAbility (params: EditAbilityServiceParams): EditAbilityServiceReturn {
        this.logger.info('Executing EditAbilityService::editAbility');
        const { ability, editParams } = params;

        const editedAbility: Ability = {
            ...ability,
            name: editParams.name.trim(),
            activationWord: editParams.activationWord,
            prompt: editParams.prompt,
            observation: editParams.observation,
            updatedAt: new Date()
        };

        return {
            success: true,
            ability: editedAbility
        };
    }
}
