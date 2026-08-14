import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';
import { IGetSamplersUseCase } from '@domain/use-cases';

export class GetSamplersUseCase implements IGetSamplersUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IGetSamplersService,
        private readonly samplerRepository: ISamplerRepository
    ) { }
    async execute (): Promise<Sampler[]> {
        this.logger.info('Executing GetSamplersUseCase::execute');
        const samplers: Sampler[] = [];
        const defaultSamplers = this.service.getSystemDefaultSamplers();
        this.logger.debug('Executing GetSamplersUseCase::execute defaultSamplers: ', defaultSamplers);

        samplers.push(...defaultSamplers);

        const savedSamplers = await this.samplerRepository.getSamplers();
        this.logger.debug('Executing GetSamplersUseCase::execute savedSamplers: ', savedSamplers);

        samplers.push(...savedSamplers);

        return samplers;
    }
}
