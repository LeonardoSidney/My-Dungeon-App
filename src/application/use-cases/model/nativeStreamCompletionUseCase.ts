import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IConnectionRepository, ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';
import {
    INativeStreamCompletionUseCase,
    NativeStreamCompletionUseCaseParams,
    NativeStreamCompletionUseCaseResponse,
} from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';

export class NativeStreamCompletionUseCase implements INativeStreamCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway,
        private readonly connectionRepository: IConnectionRepository,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService
    ) { }

    async execute (params: NativeStreamCompletionUseCaseParams): Promise<NativeStreamCompletionUseCaseResponse> {
        this.logger.info('Executing NativeStreamCompletionUseCase::execute');
        this.logger.debug('NativeStreamCompletionUseCase::execute - params', {
            adventureId: params.adventureId,
            connectionId: params.connectionId,
            samplerId: params.samplerId,
            modelId: params.modelId,
            hasHydrated: Boolean(params.hydrated),
        });

        try {
            this.validate(params);

            const connection = await this.connectionRepository.getConnectionById(params.connectionId);

            if (!connection) {
                return {
                    success: false,
                    error: `Connection not found: ${params.connectionId}`,
                };
            }

            const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);
            const sampler = await resolveSampler(params.samplerId);

            if (!sampler) {
                return {
                    success: false,
                    error: `Sampler not found: ${params.samplerId}`,
                };
            }

            const { stream, abort } = this.gateway.streamCompletion(
                connection,
                sampler,
                params.modelId,
                params.prompt
            );

            return {
                success: true,
                stream,
                abort,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in NativeStreamCompletionUseCase::execute', error);
                return {
                    success: false,
                    error: error.message || 'Native stream completion failed',
                };
            }

            this.logger.error('Error in NativeStreamCompletionUseCase::execute', error);
            return {
                success: false,
                error: 'Native stream completion failed',
            };
        }
    }

    private validate (params: NativeStreamCompletionUseCaseParams): void {
        if (!params.connectionId?.trim()) {
            throw new Error('Connection id is required');
        }

        if (!params.samplerId?.trim()) {
            throw new Error('Sampler id is required');
        }

        if (!params.prompt?.trim()) {
            throw new Error('Prompt is required');
        }
    }
}
