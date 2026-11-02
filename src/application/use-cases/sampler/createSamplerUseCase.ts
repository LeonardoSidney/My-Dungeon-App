import { getAdaptiveRangeError } from '@application/shared/adaptiveSamplerRules';
import { SamplerActionEnum } from '@domain/constants/sampler';
import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { ICreateSamplerService, IGetSamplersService } from '@domain/services';
import { CreateSamplerUseCaseParams, CreateSamplerUseCaseResponse, ICreateSamplerUseCase } from '@domain/use-cases';

export class CreateSamplerUseCase implements ICreateSamplerUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly samplerRepository: ISamplerRepository,
        private readonly service: ICreateSamplerService,
        private readonly getSamplersService: IGetSamplersService
    ) { }
    async execute (params: CreateSamplerUseCaseParams): Promise<CreateSamplerUseCaseResponse> {
        this.logger.info('Executing CreateSamplerUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const reservedNameError = this.getReservedNameError(params.name.trim());
        if (reservedNameError) {
            return {
                success: false,
                error: reservedNameError
            };
        }

        this.logger.debug('CreateSamplerUseCase::execute - params', params);
        const response = this.service.createSampler(params);
        this.logger.debug('CreateSamplerUseCase::execute - sampler created', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.sampler) {
            return {
                success: false,
                error: 'Something went wrong when creating the sampler'
            };
        }

        const sampler = response.sampler;
        const samplersResponse = await this.samplerRepository.getSamplers();
        if (!samplersResponse.success || !samplersResponse.samplers) {
            this.logger.warning('CreateSamplerUseCase::execute - failed to load samplers', samplersResponse.error);
            return { success: false, error: samplersResponse.error };
        }

        const samplers = samplersResponse.samplers;
        const alreadyExists = samplers.find(s => s.name === sampler.name);
        if (alreadyExists) {
            this.logger.warning(`A sampler with name ${sampler.name} already exists`);
            return {
                success: false,
                error: 'A sampler with this name already exists'
            };
        }

        const saveResult = await this.samplerRepository.saveSampler({ sampler });
        if (!saveResult.success) {
            this.logger.warning('CreateSamplerUseCase::execute - failed to save sampler', saveResult.error);
            return { success: false, error: saveResult.error };
        }

        return {
            success: true,
            id: response.sampler.id
        };
    }

    private validate (params: CreateSamplerUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'A name is required to create a sampler';
        }

        return getAdaptiveRangeError(params, SamplerActionEnum.CREATE);
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
