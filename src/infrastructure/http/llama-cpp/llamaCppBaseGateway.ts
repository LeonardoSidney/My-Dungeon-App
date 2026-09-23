import { Chat, Connection, Model } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { GetModelResponseDTOEntry } from './dto/getModelResponseDTO';
import { isArrayRecord, isRecord } from '@infra/dto/shared';

class LlamaCppServerError extends Error { }

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
            throw new Error(`Error fetching models from ${url}: ${this.toErrorMessage(error)}`);
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

            const loaded = entry.status?.value === 'loaded';

            models.push({
                id: entry.id,
                name: entry.name ?? this.fallbackName(entry.id),
                connectionId: connection.id,
                nCtx,
                ownedBy: entry.owned_by,
                loaded
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

            if (isRecord(item.status) && typeof item.status.value === 'string') {
                entry.status = {
                    value: item.status.value
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

            if (!response.ok) {
                const message = await this.parseErrorBody(response);
                this.logger.warning(`Executing LlamaCppBaseGateway::applyTemplate - server error ${response.status}: ${message}`);
                throw new LlamaCppServerError(`applyTemplate failed with status ${response.status}: ${message}`);
            }

            const data: unknown = await response.json();
            this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - data: ', data);

            if (!isRecord(data) || typeof data.prompt !== 'string') {
                this.logger.warning('Executing LlamaCppBaseGateway::applyTemplate - response without prompt');
                return null;
            }

            return data.prompt;
        } catch (error) {
            if (error instanceof LlamaCppServerError) {
                throw error;
            }

            throw new Error(`Error calling applyTemplate on ${url}: ${this.toErrorMessage(error)}`);
        }
    }

    private toErrorMessage (error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        return String(error);
    }

    protected async parseErrorBody (response: Response): Promise<string> {
        try {
            const body: unknown = await response.json();
            if (!isRecord(body)) {
                return 'no error details';
            }

            const error = body.error;
            if (isRecord(error) && typeof error.message === 'string') {
                return error.message;
            }

            return JSON.stringify(body);
        } catch {
            return 'no error details';
        }
    }

    protected formatChatMessages (chat: Chat[]): { role: string; content: string; }[] {
        return chat.map(c => ({
            role: c.role,
            content: c.content[c.index] ?? '',
        }));
    }
}
