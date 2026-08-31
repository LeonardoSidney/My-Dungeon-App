import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { ICreateSamplerService } from '@domain/services';
import { CreateSamplerUseCaseParams, CreateSamplerUseCaseResponse, ICreateSamplerUseCase } from '@domain/use-cases';

export class CreateSamplerUseCase implements ICreateSamplerUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly samplerRepository: ISamplerRepository,
        private readonly service: ICreateSamplerService
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
        const samplers = await this.samplerRepository.getSamplers();
        const alreadyExists = samplers.find(s => s.name === sampler.name);
        if (alreadyExists) {
            this.logger.warning(`A sampler with name ${sampler.name} already exists`);
            return {
                success: false,
                error: 'A sampler with this name already exists'
            };
        }

        await this.samplerRepository.saveSampler({ sampler });

        return {
            success: true,
            sampler: response.sampler
        };
    }

    private validate (params: CreateSamplerUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'A name is required to create a sampler';
        }

        if (params.adaptativeTarget !== undefined && (params.adaptativeTarget <= 0 || params.adaptativeTarget > 1)) {
            return 'Adaptative target must be greater than 0 and up to 1 to create a sampler';
        }

        if (params.adaptativeDecay !== undefined && (params.adaptativeDecay <= 0 || params.adaptativeDecay > 1)) {
            return 'Adaptative decay must be greater than 0 and up to 1 to create a sampler';
        }

        return null;
    }
}
