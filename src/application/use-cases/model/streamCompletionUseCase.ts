import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IConnectionRepository, ISamplerRepository } from '@domain/repository';
import {
    IStreamCompletionUseCase,
    StreamCompletionUseCaseParams,
    StreamCompletionUseCaseResponse,
} from '@domain/use-cases';

export class StreamCompletionUseCase implements IStreamCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway,
        private readonly connectionRepository: IConnectionRepository,
        private readonly samplerRepository: ISamplerRepository
    ) { }

    async execute (params: StreamCompletionUseCaseParams): Promise<StreamCompletionUseCaseResponse> {
        this.logger.info('Executing StreamCompletionUseCase::execute');
        try {
            const connection = await this.connectionRepository.getConnectionById(params.connectionId);

            if (!connection) {
                return {
                    success: false,
                    error: `Connection not found: ${params.connectionId}`,
                };
            }

            const sampler = await this.samplerRepository.getSamplerById(params.samplerId);

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
                this.logger.error('Error in StreamCompletionUseCase::execute', error);
                return {
                    success: false,
                    error: error.message || 'Stream completion failed',
                };
            }
            this.logger.error('Error in StreamCompletionUseCase::execute', error);
            return {
                success: false,
                error: 'Stream completion failed',
            };
        }
    }
}
