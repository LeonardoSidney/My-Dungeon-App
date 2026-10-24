import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository/iProficiencyRepository';
import { ICreateProficiencyService } from '@domain/services';
import { CreateProficiencyUseCaseParams, CreateProficiencyUseCaseResponse, ICreateProficiencyUseCase } from '@domain/use-cases';

export class CreateProficiencyUseCase implements ICreateProficiencyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: ICreateProficiencyService,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }
    async execute (params: CreateProficiencyUseCaseParams): Promise<CreateProficiencyUseCaseResponse> {
        this.logger.info('Executing CreateProficiencyUseCase::execute');
        this.logger.debug('Executing CreateProficiencyUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        this.logger.debug('Calling CreateProficiencyService', params);
        const response = this.service.createProficiency(params);
        this.logger.debug('CreateProficiencyService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.proficiency) {
            return {
                success: false,
                error: 'Unexpected error while creating proficiency'
            };
        }

        const proficienciesResponse = await this.proficiencyRepository.getProficiencies();
        if (!proficienciesResponse.success || !proficienciesResponse.proficiencies) {
            this.logger.warning('CreateProficiencyUseCase::execute - failed to load proficiencies', proficienciesResponse.error);
            return { success: false, error: proficienciesResponse.error };
        }

        const proficiencies = proficienciesResponse.proficiencies;
        this.logger.debug('ProficiencyRepository executed successfully', proficiencies);
        const alreadyExists = proficiencies.find(proficiency => proficiency.name === response.proficiency?.name);

        if (alreadyExists) {
            this.logger.warning(`Proficiency with name ${response.proficiency.name} already exists`);
            return {
                success: false,
                error: 'Proficiency already exists'
            };
        }

        const saveResult = await this.proficiencyRepository.saveProficiency({ proficiency: response.proficiency });
        if (!saveResult.success) {
            this.logger.warning('CreateProficiencyUseCase::execute - failed to save proficiency', saveResult.error);
            return { success: false, error: saveResult.error };
        }

        return {
            success: true,
            id: response.proficiency.id
        };
    }

    private validate (params: CreateProficiencyUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'name is required to create a proficiency';
        }

        if (!params.prompt?.trim()) {
            return 'prompt is required to create a proficiency';
        }

        if (!params.activationWord?.trim()) {
            return 'activationWord is required to create a proficiency';
        }

        return null;
    }
}
