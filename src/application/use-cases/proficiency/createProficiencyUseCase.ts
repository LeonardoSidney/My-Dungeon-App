import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository/iProficiencyRepository';
import { ICreateProficiencyService } from '@domain/services';
import { CreateProficiencyUseCaseParams, CreateProficiencyUseCaseResponse, ICreateProficiencyUseCase } from '@domain/use-cases';

export class CreateProficiencyUseCase implements ICreateProficiencyUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly service: ICreateProficiencyService,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }
    async execute(params: CreateProficiencyUseCaseParams): Promise<CreateProficiencyUseCaseResponse> {
        this.logger.info('Executing CreateProficiencyUseCase::execute');
        this.logger.debug('Executing CreateProficiencyUseCase::execute - params', params);

        this.validate(params);

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
            throw new Error('Unexpected error while creating proficiency');
        }

        const proficiencies = await this.proficiencyRepository.getProficiencies();
        this.logger.debug('ProficiencyRepository executed successfully', proficiencies);
        const alreadyExists = proficiencies.find(proficiency => proficiency.name === response.proficiency?.name);

        if (alreadyExists) {
            this.logger.warning(`Proficiency with name ${response.proficiency.name} already exists`);
            return {
                success: false,
                error: 'Proficiency already exists'
            };
        }

        await this.proficiencyRepository.saveProficiency({ proficiency: response.proficiency });

        return {
            success: true,
            proficiency: response.proficiency
        };
    }

    private validate(params: CreateProficiencyUseCaseParams) {
        if (!params.name?.trim()) {
            throw new Error('name is required to create a proficiency');
        }

        if (!params.prompt?.trim()) {
            throw new Error('prompt is required to create a proficiency');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('activationWord is required to create a proficiency');
        }
    }
}
