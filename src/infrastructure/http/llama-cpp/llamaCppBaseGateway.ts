import { Chat, Connection, Model } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { GetModelResponseDTOEntry } from './dto/getModelResponseDTO';
import { isArrayRecord, isRecord } from '../../dto/shared';

export abstract class LlamaCppBaseGateway {
    constructor (
        protected readonly logger: ILogger,
        protected readonly streamProvider: IStreamProvider
    ) { }

    protected buildUrl (connection: Connection, endpoint: string): string {
        const port = connection.port ? `:${connection.port}` : '';
        const ip = connection.ip.startsWith('http') ? connection.ip : `http://${connection.ip}`;
        return `${ip}${port}${endpoint}`;
    }

    async getModels (connection: Connection): Promise<Model[] | null> {
        this.logger.info('Executing LlamaCppBaseGateway::getModels');
        const url = this.buildUrl(connection, '/models');
        let response: Response;
        try {
            this.logger.debug('Executing LlamaCppBaseGateway::getModels - url: ', url);
            response = await fetch(url);
        } catch (error) {
            throw new Error(`Error fetching models from ${url}: ${error}`);
        }

        if (!response.ok) {
            this.logger.warning(`Executing LlamaCppBaseGateway::getModels - response not ok: ${response.status}`);
            return null;
        }

        let body: unknown;
        try {
            body = await response.json();
        } catch (error) {
            this.logger.warning('Executing LlamaCppBaseGateway::getModels - response is not valid JSON: ', error);
            return null;
        }

        const entries = this.parseModelsResponse(body);
        if (!entries) {
            this.logger.warning('Executing LlamaCppBaseGateway::getModels - response does not contain a models list');
            return null;
        }

        this.logger.debug('Executing LlamaCppBaseGateway::getModels - entries: ', entries);
        return this.toModels(entries, connection);
    }

    protected toModels (entries: GetModelResponseDTOEntry[], connection: Connection): Model[] {
        const models: Model[] = [];
        for (const entry of entries) {
            const nCtx = entry.meta?.n_ctx;
            if (nCtx === undefined) {
                this.logger.warning(`Executing LlamaCppBaseGateway::toModels - model without n_ctx, skipping: ${entry.id}`);
                continue;
            }

            models.push({
                id: entry.id,
                name: entry.name ?? this.fallbackName(entry.id),
                connectionId: connection.id,
                nCtx,
                ownedBy: entry.owned_by
            });
        }

        return models;
    }

    private fallbackName (id: string): string {
        const segments = id.split('/');
        return segments[segments.length - 1];
    }

    protected parseModelsResponse (body: unknown): GetModelResponseDTOEntry[] | null {
        if (!isRecord(body) || !isArrayRecord(body.data)) {
            return null;
        }

        const entries: GetModelResponseDTOEntry[] = [];
        for (const item of body.data) {
            if (typeof item.id !== 'string' || typeof item.owned_by !== 'string') {
                continue;
            }

            const entry: GetModelResponseDTOEntry = {
                id: item.id,
                owned_by: item.owned_by
            };

            if (typeof item.name === 'string') {
                entry.name = item.name;
            }

            if (isRecord(item.meta) && typeof item.meta.n_ctx === 'number') {
                entry.meta = {
                    n_ctx: item.meta.n_ctx
                };
            }

            entries.push(entry);
        }

        return entries;
    }

    async applyTemplate (
        connection: Connection,
        modelId: string,
        systemPrompt: string,
        chat: Chat[]
    ): Promise<string | null> {
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
                return data.prompt;
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
