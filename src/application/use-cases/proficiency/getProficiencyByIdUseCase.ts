import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';
import {
    GetProficiencyByIdUseCaseParams,
    GetProficiencyByIdUseCaseReturn,
    IGetProficiencyByIdUseCase,
} from '@domain/use-cases';

export class GetProficiencyByIdUseCase implements IGetProficiencyByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }

    async execute (params: GetProficiencyByIdUseCaseParams): Promise<GetProficiencyByIdUseCaseReturn> {
        this.logger.info('Executing GetProficiencyByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const proficiencyResponse = await this.proficiencyRepository.getProficiencyById(params.id);
        if (!proficiencyResponse.success) {
            this.logger.warning('GetProficiencyByIdUseCase::execute - failed to load proficiency', proficiencyResponse.error);
            return { success: false, error: proficiencyResponse.error };
        }

        const proficiency = proficiencyResponse.proficiency;
        if (!proficiency) {
            return { success: false, error: `Proficiency with id ${params.id} not found` };
        }

        return { success: true, proficiency };
    }

    private validate (params: GetProficiencyByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Proficiency id is required';
        }

        return null;
    }
}
