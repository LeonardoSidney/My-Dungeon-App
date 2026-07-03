import { Ability } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { IGetAbilitiesUseCase } from '@domain/use-cases';

export class GetAbilitiesUseCase implements IGetAbilitiesUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly abilityRepository: IAbilityRepository
    ) { }

    async execute(): Promise<Ability[]> {
        this.logger.info('Executing GetAbilitiesUseCase::execute');
        return this.abilityRepository.getAbilities();
    }
} 
