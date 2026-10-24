import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';
import { GetProficienciesUseCaseReturn, IGetProficienciesUseCase } from '@domain/use-cases';

export class GetProficienciesUseCase implements IGetProficienciesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }

    async execute (): Promise<GetProficienciesUseCaseReturn> {
        this.logger.info('Executing GetProficienciesUseCase::execute');

        const response = await this.proficiencyRepository.getProficiencies();
        if (!response.success || !response.proficiencies) {
            this.logger.warning('GetProficienciesUseCase::execute - failed to load proficiencies', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, proficiencies: response.proficiencies };
    }
}
