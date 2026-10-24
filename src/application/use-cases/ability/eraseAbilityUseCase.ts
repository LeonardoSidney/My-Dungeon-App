import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { EraseAbilityUseCaseReturn, IEraseAbilityUseCase, EraseAbilityUseCaseParams } from '@domain/use-cases';

export class EraseAbilityUseCase implements IEraseAbilityUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly abilityRepository: IAbilityRepository
    ) { }

    async execute (params: EraseAbilityUseCaseParams): Promise<EraseAbilityUseCaseReturn> {
        this.logger.info('Executing EraseAbilityUseCase::execute');
        this.logger.debug('Executing EraseAbilityUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.abilityRepository.eraseAbility(params.id);

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

    private validate (params: EraseAbilityUseCaseParams): string | null {
        if (!params.id) {
            return 'An ability id is required to erase an ability';
        }

        return null;
    }
}
