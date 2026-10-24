import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';
import { EraseProficiencyUseCaseReturn, IEraseProficiencyUseCase, EraseProficiencyUseCaseParams } from '@domain/use-cases';

export class EraseProficiencyUseCase implements IEraseProficiencyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }

    async execute (params: EraseProficiencyUseCaseParams): Promise<EraseProficiencyUseCaseReturn> {
        this.logger.info('Executing EraseProficiencyUseCase::execute');
        this.logger.debug('Executing EraseProficiencyUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.proficiencyRepository.eraseProficiency(params.id);

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

    private validate (params: EraseProficiencyUseCaseParams): string | null {
        if (!params.id) {
            return 'A proficiency id is required to erase a proficiency';
        }

        return null;
    }
}
