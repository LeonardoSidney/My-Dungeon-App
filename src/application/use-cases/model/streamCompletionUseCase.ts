import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IStreamCompletionUseCase, StreamCompletionUseCaseParams, StreamCompletionUseCaseResponse } from '@domain/use-cases';

export class StreamCompletionUseCase implements IStreamCompletionUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway
    ) { }

    async execute(params: StreamCompletionUseCaseParams): Promise<StreamCompletionUseCaseResponse> {
        this.logger.info('Executing StreamCompletionUseCase::execute');
        try {
            const stream = this.gateway.streamCompletion(params.connection, {
                modelId: params.modelId,
                prompt: params.prompt,
                temperature: params.temperature,
                topP: params.topP,
                maxTokens: params.maxTokens
            });

            return {
                success: true,
                stream
            };
        } catch (error: any) {
            this.logger.error('Error in StreamCompletionUseCase::execute', error);
            return {
                success: false,
                error: error.message || 'Stream completion failed'
            };
        }
    }
}
