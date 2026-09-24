import { IModelProviderGateway, ModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { mapSamplerToOAPayload, OAPayload } from './dto/samplerToOAPayload';
import { LlamaCppBaseGateway } from '../llamaCppBaseGateway';

export class LlamaCppOAGateway extends LlamaCppBaseGateway implements IModelProviderGateway {
    constructor (logger: ILogger, streamProvider: IStreamProvider) {
        super(logger, streamProvider);
    }

    streamCompletion (params: ModelProviderGateway.StreamCompletionParams): ModelProviderGateway.StreamResult {
        this.logger.info('Executing LlamaCppOAGateway::streamCompletion');
        const { connection, sampler, modelId, prompt } = params;

        const url = this.buildUrl(connection, '/v1/completions');

        const body: OAPayload = mapSamplerToOAPayload(sampler, modelId, prompt);

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
                    const finishReason = parsed.choices?.[0]?.finish_reason;
                    if (finishReason !== 'stop') {
                        const text = parsed.choices?.[0]?.text;
                        if (typeof text !== 'string') {
                            continue;
                        }

                        yield text;
                    }
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
