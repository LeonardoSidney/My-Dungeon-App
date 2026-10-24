import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';
import { IEditProficiencyService } from '@domain/services';
import { EditProficiencyParams, EditProficiencyReturn, IEditProficiencyUseCase } from '@domain/use-cases';

export class EditProficiencyUseCase implements IEditProficiencyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditProficiencyService,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }

    async execute (params: EditProficiencyParams): Promise<EditProficiencyReturn> {
        this.logger.info('Executing EditProficiencyUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const proficiencyResponse = await this.proficiencyRepository.getProficiencyById(id);
        if (!proficiencyResponse.success) {
            this.logger.warning('EditProficiencyUseCase::execute - failed to load proficiency', proficiencyResponse.error);
            return { success: false, error: proficiencyResponse.error };
        }

        const proficiency = proficiencyResponse.proficiency;
        if (!proficiency) {
            return {
                success: false,
                error: `Proficiency with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditProficiencyService', { id, editParams });
        const response = this.service.editProficiency({ proficiency, editParams });
        this.logger.debug('EditProficiencyService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditProficiencyService'
            };
        }

        if (!response.proficiency) {
            return {
                success: false,
                error: 'Success is true but does not have a proficiency'
            };
        }

        const editedProficiency = response.proficiency;
        const existingProficienciesResponse = await this.proficiencyRepository.getProficiencies();
        if (!existingProficienciesResponse.success || !existingProficienciesResponse.proficiencies) {
            this.logger.warning('EditProficiencyUseCase::execute - failed to load proficiencies', existingProficienciesResponse.error);
            return { success: false, error: existingProficienciesResponse.error };
        }

        const existingProficiencies = existingProficienciesResponse.proficiencies;
        const duplicateProficiency = existingProficiencies.find(
            (p) => p.name === editedProficiency.name && p.id !== editedProficiency.id
        );

        if (duplicateProficiency) {
            this.logger.warning(`Proficiency with name ${editedProficiency.name} already exists`);
            return {
                success: false,
                error: `Proficiency with name ${editedProficiency.name} already exists`
            };
        }

        const editResult = await this.proficiencyRepository.editProficiency({ proficiency: editedProficiency });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit proficiency'
            };
        }

        return {
            id: editedProficiency.id,
            success: true
        };
    }

    private validate (params: EditProficiencyParams): string | null {
        if (!params.id) {
            return 'An id is required to edit a proficiency';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a proficiency';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit a proficiency';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit a proficiency';
        }

        return null;
    }
}
