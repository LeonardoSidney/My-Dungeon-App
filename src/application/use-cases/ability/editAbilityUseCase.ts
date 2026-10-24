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
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const abilityResponse = await this.abilityRepository.getAbilityById(id);
        if (!abilityResponse.success) {
            this.logger.warning('EditAbilityUseCase::execute - failed to load ability', abilityResponse.error);
            return { success: false, error: abilityResponse.error };
        }

        const ability = abilityResponse.ability;
        if (!ability) {
            return {
                success: false,
                error: `Ability with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditAbilityService', { id, editParams });
        const response = this.service.editAbility({ ability, editParams });
        this.logger.debug('EditAbilityService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditAbilityService'
            };
        }

        if (!response.ability) {
            return {
                success: false,
                error: 'Success is true but does not have an ability'
            };
        }

        const editedAbility = response.ability;
        const existingAbilitiesResponse = await this.abilityRepository.getAbilities();
        if (!existingAbilitiesResponse.success || !existingAbilitiesResponse.abilities) {
            this.logger.warning('EditAbilityUseCase::execute - failed to load abilities', existingAbilitiesResponse.error);
            return { success: false, error: existingAbilitiesResponse.error };
        }

        const existingAbilities = existingAbilitiesResponse.abilities;
        const duplicateAbility = existingAbilities.find(
            (a) => a.name === editedAbility.name && a.id !== editedAbility.id
        );

        if (duplicateAbility) {
            this.logger.warning(`Ability with name ${editedAbility.name} already exists`);
            return {
                success: false,
                error: `Ability with name ${editedAbility.name} already exists`
            };
        }

        const editResult = await this.abilityRepository.editAbility({ ability: editedAbility });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit ability'
            };
        }

        return {
            id: editedAbility.id,
            success: true
        };
    }

    private validate (params: EditAbilityParams): string | null {
        if (!params.id) {
            return 'An id is required to edit an ability';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit an ability';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation world is required to edit an ability';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit an ability';
        }

        return null;
    }
}
