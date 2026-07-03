import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { ICreateSamplerService } from '@domain/services';
import { CreateSamplerUseCaseParams, CreateSamplerUseCaseResponse, ICreateSamplerUseCase } from '@domain/use-cases';

export class CreateSamplerUseCase implements ICreateSamplerUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly samplerRepository: ISamplerRepository,
        private readonly service: ICreateSamplerService
    ) { }
    async execute(params: CreateSamplerUseCaseParams): Promise<CreateSamplerUseCaseResponse> {
        this.logger.info('Executing CreateSamplerUseCase::execute');
        this.validate(params);
        this.logger.debug('CreateSamplerUseCase::execute - params', params);
        const response = this.service.createSampler(params);
        this.logger.debug('CreateSamplerUseCase::execute - sampler created', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        const samplers = await this.samplerRepository.getSamplers();
        const alreadyExists = samplers.find(s => s.name === response.sampler?.name);
        if (alreadyExists) {
            return {
                success: false,
                error: 'A sampler with this name already exists'
            };
        }

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred'
            };
        }

        if (!response.sampler) {
            throw new Error('Something went wrong when creating the sampler');
        }

        await this.samplerRepository.saveSampler({ sampler: response.sampler });

        return {
            success: response.success,
            sampler: response.sampler
        };
    }

    private validate(params: CreateSamplerUseCaseParams): void {
        if (!params.name?.trim()) {
            throw new Error('A name is required to create a sampler');
        }

        if (
            params.adaptativeTarget &&
            params.adaptativeTarget > 0 &&
            params.adaptativeTarget <= 1
        ) {
            throw new Error('A valid adaptative target is required to create a sampler');
        }

        if (
            params.adaptativeDecay &&
            params.adaptativeDecay > 0 &&
            params.adaptativeDecay <= 1
        ) {
            throw new Error('A valid adaptative decay is required to create a sampler');
        }
    }
}
