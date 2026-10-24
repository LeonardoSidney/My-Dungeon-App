import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';
import { GetSamplersUseCaseReturn, IGetSamplersUseCase } from '@domain/use-cases';

export class GetSamplersUseCase implements IGetSamplersUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IGetSamplersService,
        private readonly samplerRepository: ISamplerRepository
    ) { }
    async execute (): Promise<GetSamplersUseCaseReturn> {
        this.logger.info('Executing GetSamplersUseCase::execute');

        const samplers: Sampler[] = [];
        const defaultSamplers = this.service.getSystemDefaultSamplers();
        this.logger.debug('Executing GetSamplersUseCase::execute defaultSamplers: ', defaultSamplers);

        samplers.push(...defaultSamplers);

        const savedSamplersResponse = await this.samplerRepository.getSamplers();
        if (!savedSamplersResponse.success || !savedSamplersResponse.samplers) {
            this.logger.warning('GetSamplersUseCase::execute - failed to load samplers', savedSamplersResponse.error);
            return { success: false, error: savedSamplersResponse.error };
        }

        const savedSamplers = savedSamplersResponse.samplers;
        this.logger.debug('Executing GetSamplersUseCase::execute savedSamplers: ', savedSamplers);

        samplers.push(...savedSamplers);

        return { success: true, samplers };
    }
}
