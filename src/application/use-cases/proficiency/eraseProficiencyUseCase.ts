import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';
import { EraseProficiencyUseCaseReturn, IEraseProficiencyUseCase } from '@domain/use-cases';

export class EraseProficiencyUseCase implements IEraseProficiencyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }

    async execute (proficiencyId: string): Promise<EraseProficiencyUseCaseReturn> {
        this.logger.info('Executing EraseProficiencyUseCase::execute');
        this.logger.debug('Executing EraseProficiencyUseCase::execute - proficiencyId: ', proficiencyId);

        const result = await this.proficiencyRepository.eraseProficiency(proficiencyId);

        if (!result.success) {
            this.logger.warning('Failed to erase proficiency', result);
            return {
                success: false,
                error: result.error || 'Failed to erase proficiency'
            };
        }

        this.logger.info('Proficiency erased successfully');
        return { success: true };
    }
}
