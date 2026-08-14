import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import {
    INativeStreamCompletionUseCase,
    NativeStreamCompletionUseCaseParams,
    NativeStreamCompletionUseCaseResponse,
} from '@domain/use-cases';

export class NativeStreamCompletionUseCase implements INativeStreamCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway
    ) {}

    async execute (params: NativeStreamCompletionUseCaseParams): Promise<NativeStreamCompletionUseCaseResponse> {
        this.logger.info('Executing NativeStreamCompletionUseCase::execute');

        try {
            this.validate(params);

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
        if (!params.prompt?.trim()) {
            throw new Error('Prompt is required');
        }

        if (!params.connection?.ip) {
            throw new Error('Connection IP is required');
        }
    }
}
