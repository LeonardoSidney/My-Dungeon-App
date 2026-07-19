import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { EraseSamplerUseCaseReturn, IEraseSamplerUseCase } from '@domain/use-cases';

export class EraseSamplerUseCase implements IEraseSamplerUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly samplerRepository: ISamplerRepository
    ) { }

    async execute (samplerId: string): Promise<EraseSamplerUseCaseReturn> {
        this.logger.info('Executing EraseSamplerUseCase::execute');
        this.logger.debug('Executing EraseSamplerUseCase::execute - samplerId: ', samplerId);

        const result = await this.samplerRepository.eraseSampler(samplerId);

        if (!result.success) {
            this.logger.warning('Failed to erase sampler', result);
            return {
                success: false,
                error: result.error || 'Failed to erase sampler'
            };
        }

        this.logger.info('Sampler erased successfully');
        return { success: true };
    }
}
