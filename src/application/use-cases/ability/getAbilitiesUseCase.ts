import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { GetAbilitiesUseCaseReturn, IGetAbilitiesUseCase } from '@domain/use-cases';

export class GetAbilitiesUseCase implements IGetAbilitiesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly abilityRepository: IAbilityRepository
    ) { }

    async execute (): Promise<GetAbilitiesUseCaseReturn> {
        this.logger.info('Executing GetAbilitiesUseCase::execute');

        const response = await this.abilityRepository.getAbilities();
        if (!response.success || !response.abilities) {
            this.logger.warning('GetAbilitiesUseCase::execute - failed to load abilities', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, abilities: response.abilities };
    }
} 
