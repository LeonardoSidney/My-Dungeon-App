import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';
import { createSamplerResolver } from '@application/shared/resolveSampler';
import {
    GetSamplerByIdUseCaseParams,
    GetSamplerByIdUseCaseReturn,
    IGetSamplerByIdUseCase,
} from '@domain/use-cases';

export class GetSamplerByIdUseCase implements IGetSamplerByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService
    ) { }

    async execute (params: GetSamplerByIdUseCaseParams): Promise<GetSamplerByIdUseCaseReturn> {
        this.logger.info('Executing GetSamplerByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const response = await createSamplerResolver(this.samplerRepository, this.getSamplersService)(params.id);
        if (!response.success) {
            this.logger.warning('GetSamplerByIdUseCase::execute - failed to load sampler', response.error);
            return { success: false, error: response.error };
        }

        const sampler = response.sampler;
        if (!sampler) {
            return { success: false, error: `Sampler with id ${params.id} not found` };
        }

        return { success: true, sampler };
    }

    private validate (params: GetSamplerByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Sampler id is required';
        }

        return null;
    }
}
