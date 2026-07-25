import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { IEditAbilityService } from '@domain/services';
import { EditAbilityParams, EditAbilityReturn, IEditAbilityUseCase } from '@domain/use-cases';

export class EditAbilityUseCase implements IEditAbilityUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditAbilityService,
        private readonly abilityRepository: IAbilityRepository
    ) { }

    async execute (params: EditAbilityParams): Promise<EditAbilityReturn> {
        this.logger.info('Executing EditAbilityUseCase::execute');
        this.validate(params);

        const { ability } = params;

        this.logger.debug('Calling EditAbilityService', ability);
        const response = this.service.editAbility({ ability });
        this.logger.debug('EditAbilityService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                ability: undefined,
                error: response.error || 'An unknown error occurred on EditAbilityService'
            };
        }

        if (!response.ability) {
            return {
                success: false,
                ability: undefined,
                error: 'Success is true but does not have an ability'
            };
        }

        const editedAbility = response.ability;
        const existingAbilities = await this.abilityRepository.getAbilities();
        const duplicateAbility = existingAbilities.find(
            (a) => a.name === editedAbility.name && a.id !== editedAbility.id
        );

        if (duplicateAbility) {
            this.logger.warning(`Ability with name ${editedAbility.name} already exists`);
            return {
                success: false,
                ability: undefined,
                error: `Ability with name ${editedAbility.name} already exists`
            };
        }

        const editResult = await this.abilityRepository.editAbility({ ability: editedAbility });
        if (!editResult.success) {
            return {
                success: false,
                ability: undefined,
                error: editResult.error || 'Failed to edit ability'
            };
        }

        return {
            ability: editedAbility,
            success: true
        };
    }

    private validate (params: EditAbilityParams): void {
        const { ability } = params;

        if (!ability.id) {
            throw new Error('An id is required to edit an ability');
        }

        if (!ability.name?.trim()) {
            throw new Error('A name is required to edit an ability');
        }

        if (!ability.activationWorld?.trim()) {
            throw new Error('An activation world is required to edit an ability');
        }

        if (!ability.prompt?.trim()) {
            throw new Error('A prompt is required to edit an ability');
        }
    }
}
