import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { EraseAbilityUseCaseReturn, IEraseAbilityUseCase } from '@domain/use-cases';

export class EraseAbilityUseCase implements IEraseAbilityUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly abilityRepository: IAbilityRepository
    ) { }

    async execute (abilityId: string): Promise<EraseAbilityUseCaseReturn> {
        this.logger.info('Executing EraseAbilityUseCase::execute');
        this.logger.debug('Executing EraseAbilityUseCase::execute - abilityId: ', abilityId);

        const result = await this.abilityRepository.eraseAbility(abilityId);

        if (!result.success) {
            this.logger.warning('Failed to erase ability', result);
            return {
                success: false,
                error: result.error || 'Failed to erase ability'
            };
        }

        this.logger.info('Ability erased successfully');
        return { success: true };
    }
}
