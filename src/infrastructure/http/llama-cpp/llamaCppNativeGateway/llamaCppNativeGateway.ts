import { IModelProviderGateway, ModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { mapSamplerToNativePayload, NativePayload } from './dto/samplerToNativePayload';
import { LlamaCppBaseGateway } from '../llamaCppBaseGateway';

export class LlamaCppNativeGateway extends LlamaCppBaseGateway implements IModelProviderGateway {
    constructor (logger: ILogger, streamProvider: IStreamProvider) {
        super(logger, streamProvider);
    }

    streamCompletion (params: ModelProviderGateway.StreamCompletionParams): ModelProviderGateway.StreamResult {
        this.logger.info('Executing LlamaCppNativeGateway::streamCompletion');
        const { connection, sampler, modelId, prompt } = params;

        const url = this.buildUrl(connection, '/completion');

        const body: NativePayload = mapSamplerToNativePayload(sampler, modelId, prompt);

        const streamParams = {
            url,
            method: 'POST' as const,
            headers: {
                'Content-Type': 'application/json',
            },
            body,
        };

        const { stream: providerStream, abort } = this.streamProvider.stream(streamParams);
        const logger = this.logger;

        async function* generate (): AsyncGenerator<string> {
            for await (const chunkString of providerStream) {
                try {
                    const parsed = JSON.parse(chunkString);
                    if (parsed.stop) {
                        continue;
                    }

                    if (typeof parsed.content !== 'string') {
                        continue;
                    }

                    yield parsed.content;
                } catch (error) {
                    logger.error('Error parsing streaming completion chunk:', error);
                }
            }
        }

        return {
            stream: generate(),
            abort,
        };
    }
}
