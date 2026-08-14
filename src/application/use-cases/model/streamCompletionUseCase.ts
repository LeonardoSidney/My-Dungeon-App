import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import {
    IStreamCompletionUseCase,
    StreamCompletionUseCaseParams,
    StreamCompletionUseCaseResponse,
} from '@domain/use-cases';

export class StreamCompletionUseCase implements IStreamCompletionUseCase {
    constructor (private readonly logger: ILogger, private readonly gateway: IModelProviderGateway) {}

    async execute (params: StreamCompletionUseCaseParams): Promise<StreamCompletionUseCaseResponse> {
        this.logger.info('Executing StreamCompletionUseCase::execute');
        try {
            const { stream, abort } = this.gateway.streamCompletion(
                params.connection,
                params.sampler,
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
