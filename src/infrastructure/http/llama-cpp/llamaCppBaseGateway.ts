import { Chat, Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { GetModelResponseDTO } from './dto/getModelResponseDTO';
import { ApplyTemplateResponseDTO } from './dto/applyTemplateResponseDTO';

export abstract class LlamaCppBaseGateway {
    constructor (
        protected readonly logger: ILogger,
        protected readonly streamProvider: IStreamProvider
    ) {}

    protected buildUrl (connection: Connection, endpoint: string): string {
        const port = connection.port ? `:${connection.port}` : '';
        const ip = connection.ip.startsWith('http') ? connection.ip : `http://${connection.ip}`;
        return `${ip}${port}${endpoint}`;
    }

    async getModels (connection: Connection): Promise<GetModelResponseDTO | null> {
        this.logger.info('Executing LlamaCppBaseGateway::getModels');
        const url = this.buildUrl(connection, '/models');
        try {
            this.logger.debug('Executing LlamaCppBaseGateway::getModels - url: ', url);
            const response = await fetch(url);
            this.logger.debug('Executing LlamaCppBaseGateway::getModels - response: ', response);
            if (response.ok) {
                const data = await response.json();
                this.logger.debug('Executing LlamaCppBaseGateway::getModels - data: ', data);
                if (data.models) {
                    return new GetModelResponseDTO(data.data, data.models);
                }
            }
        } catch (error) {
            throw new Error(`Error fetching models from ${url}: ${error}`);
        }

        return null;
    }

    async applyTemplate (
        connection: Connection,
        modelId: string,
        systemPrompt: string,
        chat: Chat[]
    ): Promise<ApplyTemplateResponseDTO | null> {
        this.logger.info('Executing LlamaCppBaseGateway::applyTemplate');
        const url = this.buildUrl(connection, '/apply-template');
        const chats = this.formatChatMessages(chat);
        const body = {
            model: modelId,
            messages: [{ role: 'system', content: systemPrompt }, ...chats],
        };
        try {
            this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - url: ', url);
            this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - body: ', JSON.stringify(body));
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - response: ', response);
            if (response.ok) {
                const data = await response.json();
                this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - data: ', data);
                return new ApplyTemplateResponseDTO(data.prompt);
            }
        } catch (error) {
            throw new Error(`Error calling applyTemplate on ${url}: ${error}`);
        }

        return null;
    }

    protected formatChatMessages (chat: Chat[]): { role: string; content: string; }[] {
        return chat.map(c => ({
            role: c.role,
            content: c.content[c.index],
        }));
    }
}
