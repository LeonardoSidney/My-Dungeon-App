import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';
import { EraseSamplerUseCaseReturn, IEraseSamplerUseCase, EraseSamplerUseCaseParams } from '@domain/use-cases';

export class EraseSamplerUseCase implements IEraseSamplerUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly samplerRepository: ISamplerRepository
    ) { }

    async execute (params: EraseSamplerUseCaseParams): Promise<EraseSamplerUseCaseReturn> {
        this.logger.info('Executing EraseSamplerUseCase::execute');
        this.logger.debug('Executing EraseSamplerUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.samplerRepository.eraseSampler(params.id);

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

    private validate (params: EraseSamplerUseCaseParams): string | null {
        if (!params.id) {
            return 'A sampler id is required to erase a sampler';
        }

        return null;
    }
}
