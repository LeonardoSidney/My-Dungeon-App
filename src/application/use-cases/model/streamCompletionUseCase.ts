import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IConnectionRepository, ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';
import {
    IStreamCompletionUseCase,
    StreamCompletionUseCaseParams,
    StreamCompletionUseCaseResponse,
} from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';

export class StreamCompletionUseCase implements IStreamCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway,
        private readonly connectionRepository: IConnectionRepository,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService
    ) { }

    async execute (params: StreamCompletionUseCaseParams): Promise<StreamCompletionUseCaseResponse> {
        this.logger.info('Executing StreamCompletionUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const connectionResponse = await this.connectionRepository.getConnectionById(params.connectionId);
        if (!connectionResponse.success) {
            this.logger.warning('StreamCompletionUseCase::execute - failed to load connection', connectionResponse.error);
            return { success: false, error: connectionResponse.error };
        }

        const connection = connectionResponse.connection;

        if (!connection) {
            return {
                success: false,
                error: `Connection not found: ${params.connectionId}`,
            };
        }

        const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);
        const samplerResponse = await resolveSampler(params.samplerId);
        if (!samplerResponse.success) {
            this.logger.warning('StreamCompletionUseCase::execute - failed to load sampler', samplerResponse.error);
            return { success: false, error: samplerResponse.error };
        }

        const sampler = samplerResponse.sampler;
        if (!sampler) {
            return {
                success: false,
                error: `Sampler not found: ${params.samplerId}`,
            };
        }

        const { stream, abort } = this.gateway.streamCompletion({
            connection,
            sampler,
            modelId: params.modelId,
            prompt: params.prompt
        });

        return {
            success: true,
            stream,
            abort,
        };
    }

    private validate (params: StreamCompletionUseCaseParams): string | null {
        if (!params.connectionId?.trim()) {
            return 'Connection id is required';
        }

        if (!params.modelId?.trim()) {
            return 'Model id is required';
        }

        if (!params.prompt?.trim()) {
            return 'Prompt is required';
        }

        return null;
    }
}
