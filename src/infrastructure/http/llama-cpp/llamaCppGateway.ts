import { Chat, Connection } from '@domain/entities';
import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { GetModelResponseDTO } from './dto/getModelResponseDTO';
import { ApplyTemplateResponseDTO } from './dto/applyTemplateResponseDTO';

export namespace LlamaCppGateway {
    export type templateResponse = {
        prompt: string;
    };
}

export class LlamaCppGateway implements IModelProviderGateway {
    constructor(
        private readonly logger: ILogger,
        private readonly streamProvider: IStreamProvider
    ) { }

    async *streamCompletion(
        connection: Connection,
        params: {
            modelId: string;
            prompt: string;
            temperature?: number;
            topP?: number;
            maxTokens?: number;
        }
    ): AsyncGenerator<string> {
        this.logger.info('Executing LlamaCppGateway::streamCompletion');
        const port = connection.port ? `:${connection.port}` : '';
        const ip = connection.ip.startsWith('http') ? connection.ip : `http://${connection.ip}`;
        const url = `${ip}${port}/v1/completions`;

        const body = {
            model: params.modelId,
            prompt: params.prompt,
            stream: true,
            temperature: params.temperature ?? 1,
            top_p: params.topP ?? 1,
            max_tokens: params.maxTokens ?? 500
        };

        const streamParams = {
            url,
            method: 'POST' as const,
            headers: {
                'Content-Type': 'application/json'
            },
            body
        };

        for await (const chunkString of this.streamProvider.stream(streamParams)) {
            try {
                const parsed = JSON.parse(chunkString);
                const text = parsed.choices?.[0]?.text;
                if (text) {
                    yield text;
                }
            } catch (error) {
                this.logger.error('Error parsing streaming completion chunk:', error);
            }
        }
    }

    async getModels(connection: Connection): Promise<GetModelResponseDTO | null> {
        this.logger.info('Executing LlamaCppGateway::getModels');
        const port = connection.port ? `:${connection.port}` : '';
        const ip = connection.ip.startsWith('http') ? connection.ip : `http://${connection.ip}`;
        const url = `${ip}${port}/models`;
        try {
            this.logger.debug('Executing LlamaCppGateway::getModels - url: ', url);
            const response = await fetch(url);
            this.logger.debug('Executing LlamaCppGateway::getModels - response: ', response);
            if (response.ok) {
                const data = await response.json();
                this.logger.debug('Executing LlamaCppGateway::getModels - data: ', data);
                if (data.models) {
                    return new GetModelResponseDTO(data.data, data.models);
                }
            }
        } catch (error) {
            throw new Error(`Error fetching models from ${url}: ${error}`);
        }

        return null;
    }

    async applyTemplate(connection: Connection, modelId: string, systemPrompt: string, chat: Chat[]): Promise<ApplyTemplateResponseDTO | null> {
        this.logger.info('Executing LlamaCppGateway::applyTemplate');
        const port = connection.port ? `:${8080}` : '';
        const ip = connection.ip.startsWith('http') ? connection.ip : `http://${connection.ip}`;
        const url = `${ip}${port}/apply-template`;
        const chats = this.formatChatMessages(chat);
        const body = {
            model: modelId,
            messages: [
                { role: 'system', content: systemPrompt },
                ...chats
            ]
        };
        try {
            this.logger.debug('Executing LlamaCppGateway::applyTemplate - url: ', url);
            this.logger.debug('Executing LlamaCppGateway::applyTemplate - body: ', JSON.stringify(body));
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            this.logger.debug('Executing LlamaCppGateway::applyTemplate - response: ', response);
            if (response.ok) {
                const data = await response.json();
                this.logger.debug('Executing LlamaCppGateway::applyTemplate - data: ', data);
                return new ApplyTemplateResponseDTO(data.prompt);
            }
        } catch (error) {
            throw new Error(`Error calling applyTemplate on ${url}: ${error}`);
        }

        return null;
    }

    private formatChatMessages(chat: Chat[]): { role: string; content: string; }[] {
        return chat.map(c => ({
            role: c.role,
            content: c.content[c.index]
        }));
    }
}
