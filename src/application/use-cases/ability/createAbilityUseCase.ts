import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository/iAbilityRepository';
import { ICreateAbilityService } from '@domain/services';
import { CreateAbilityUseCaseParams, CreateAbilityUseCaseResponse, ICreateAbilityUseCase } from '@domain/use-cases';

export class CreateAbilityUseCase implements ICreateAbilityUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly service: ICreateAbilityService,
        private readonly abilityRepository: IAbilityRepository
    ) { }
    async execute(params: CreateAbilityUseCaseParams): Promise<CreateAbilityUseCaseResponse> {
        this.logger.info('Executing CreateAbilityUseCase::execute');
        this.logger.debug('Executing CreateAbilityUseCase::execute - params', params);

        this.validate(params);

        this.logger.debug('Calling CreateAbilityService', params);
        const response = this.service.createAbility(params);
        this.logger.debug('CreateAbilityService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.ability) {
            throw new Error('Unexpected error while creating ability');
        }

        const abilities = await this.abilityRepository.getAbilities();
        this.logger.debug('AbilityRepository executed successfully', abilities);
        const alreadyExists = abilities.find(ability => ability.name === response.ability?.name);

        if (alreadyExists) {
            this.logger.warning(`Ability with name ${response.ability.name} already exists`);
            return {
                success: false,
                error: 'Ability already exists'
            };
        }

        await this.abilityRepository.saveAbility({ ability: response.ability });

        return {
            success: true,
            ability: response.ability
        };
    }

    private validate(params: CreateAbilityUseCaseParams) {
        if (!params.name?.trim()) {
            throw new Error('name is required to create an ability');
        }

        if (!params.activationWorld?.trim()) {
            throw new Error('activationWorld is required to create an ability');
        }

        if (!params.prompt?.trim()) {
            throw new Error('prompt is required to create an ability');
        }
    }
}
