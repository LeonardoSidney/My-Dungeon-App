import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { IEditSamplerService, IGetSamplersService } from '@domain/services';
import { EditSamplerParams, EditSamplerReturn, IEditSamplerUseCase } from '@domain/use-cases';

export class EditSamplerUseCase implements IEditSamplerUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditSamplerService,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService
    ) { }

    async execute (params: EditSamplerParams): Promise<EditSamplerReturn> {
        this.logger.info('Executing EditSamplerUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                sampler: undefined,
                error: validationError
            };
        }

        const reservedNameError = this.getReservedNameError(params.editParams.name);
        if (reservedNameError) {
            return {
                success: false,
                sampler: undefined,
                error: reservedNameError
            };
        }

        const { id, editParams } = params;
        const sampler = await this.samplerRepository.getSamplerById(id);
        if (!sampler) {
            return {
                success: false,
                sampler: undefined,
                error: `Sampler with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditSamplerService', { id, editParams });
        const response = this.service.editSampler({ sampler, editParams });
        this.logger.debug('EditSamplerService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                sampler: undefined,
                error: response.error || 'An unknown error occurred on EditSamplerService'
            };
        }

        if (!response.sampler) {
            return {
                success: false,
                sampler: undefined,
                error: 'Success is true but does not have a sampler'
            };
        }

        const editedSampler = response.sampler;
        const existingSamplers = await this.samplerRepository.getSamplers();
        const duplicateSampler = existingSamplers.find(
            (s) => s.name === editedSampler.name && s.id !== editedSampler.id
        );

        if (duplicateSampler) {
            this.logger.warning(`Sampler with name ${editedSampler.name} already exists`);
            return {
                success: false,
                sampler: undefined,
                error: `Sampler with name ${editedSampler.name} already exists`
            };
        }

        const saveResult = await this.samplerRepository.editSampler({ sampler: editedSampler });

        if (!saveResult.success) {
            this.logger.error('Failed to save edited sampler', saveResult);
            return {
                success: false,
                sampler: undefined,
                error: saveResult.error || 'Failed to save sampler'
            };
        }

        return {
            success: true,
            sampler: editedSampler
        };
    }

    private validate (params: EditSamplerParams): string | null {
        if (!params.id?.trim()) {
            return 'A sampler id is required to edit a sampler';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a sampler';
        }

        return null;
    }

    private getReservedNameError (name: string): string | null {
        const defaultNames = this.getSamplersService.getSystemDefaultSamplers()
            .map(defaultSampler => defaultSampler.name);
        const isReserved = defaultNames.includes(name);
        if (!isReserved) {
            return null;
        }
        return `Sampler name "${name}" is reserved for a system default sampler`;
    }
}
