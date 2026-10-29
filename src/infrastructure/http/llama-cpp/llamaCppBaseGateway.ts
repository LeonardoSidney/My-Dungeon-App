import { Connection, Model } from '@domain/entities';
import type { ModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { GetModelResponseDTOEntry } from './dto/getModelResponseDTO';
import { mapToApplyTemplateRequest } from './dto/applyTemplateRequestDTO';
import { isArrayRecord, isRecord } from '@infra/dto/shared';

type RequestResult = {
    success: boolean;
    response?: Response;
    error?: string;
};

type ReadJsonResult = {
    success: boolean;
    data?: unknown;
    error?: string;
};

export abstract class LlamaCppBaseGateway {
    constructor (
        protected readonly logger: ILogger,
        protected readonly streamProvider: IStreamProvider
    ) { }

    protected buildUrl (connection: Connection, endpoint: string): string {
        const port = connection.port ? `:${connection.port}` : '';
        const address = this.withScheme(connection.ip);
        return `${address}${port}${endpoint}`;
    }

    private withScheme (address: string): string {
        const hasScheme = /^https?:\/\//i.test(address);
        if (hasScheme) {
            return address;
        }

        return `https://${address}`;
    }

    protected buildAuthHeaders (connection: Connection): Record<string, string> {
        if (connection.auth === undefined) {
            return {};
        }

        return { Authorization: `Bearer ${connection.auth}` };
    }

    async getModels (connection: Connection): Promise<ModelProviderGateway.GetModelsResult> {
        this.logger.info('Executing LlamaCppBaseGateway::getModels');
        const url = this.buildUrl(connection, '/models');
        this.logger.debug('Executing LlamaCppBaseGateway::getModels - url: ', url);

        const response = await this.request(url, { headers: this.buildAuthHeaders(connection) });
        if (!response.success || !response.response) {
            return { success: false, error: `Error fetching models from ${url}: ${response.error}` };
        }

        if (!response.response.ok) {
            this.logger.warning(`Executing LlamaCppBaseGateway::getModels - response not ok: ${response.response.status}`);
            return { success: false, error: `getModels failed with status ${response.response.status}` };
        }

        const body = await this.readJson(response.response);
        if (!body.success) {
            this.logger.warning('Executing LlamaCppBaseGateway::getModels - response is not valid JSON: ', body.error);
            return { success: false, error: `Error reading models from ${url}: ${body.error}` };
        }

        const entries = this.parseModelsResponse(body.data);
        if (!entries) {
            this.logger.warning('Executing LlamaCppBaseGateway::getModels - response does not contain a models list');
            return { success: false, error: 'Models response does not contain a models list' };
        }

        this.logger.debug('Executing LlamaCppBaseGateway::getModels - entries: ', entries);
        return { success: true, models: this.toModels(entries, connection) };
    }

    async getProps (params: ModelProviderGateway.GetPropsParams): Promise<ModelProviderGateway.GetPropsResult> {
        this.logger.info('Executing LlamaCppBaseGateway::getProps');
        const { connection, modelId } = params;
        const autoload = params.autoload ?? false;
        const endpoint = `/props?model=${encodeURIComponent(modelId)}&autoload=${autoload}`;
        const url = this.buildUrl(connection, endpoint);
        this.logger.debug('Executing LlamaCppBaseGateway::getProps - url: ', url);

        const response = await this.request(url, { headers: this.buildAuthHeaders(connection) });
        if (!response.success || !response.response) {
            return { success: false, error: `Error calling getProps on ${url}: ${response.error}` };
        }

        if (!response.response.ok) {
            const message = await this.parseErrorBody(response.response);
            this.logger.warning(`Executing LlamaCppBaseGateway::getProps - server error ${response.response.status}: ${message}`);
            return { success: false, error: `getProps failed with status ${response.response.status}: ${message}` };
        }

        const body = await this.readJson(response.response);
        if (!body.success) {
            return { success: false, error: `Error calling getProps on ${url}: ${body.error}` };
        }

        const data = body.data;
        this.logger.debug('Executing LlamaCppBaseGateway::getProps - data: ', data);

        if (!isRecord(data) || Array.isArray(data)) {
            this.logger.warning('Executing LlamaCppBaseGateway::getProps - response is not a record');
            return { success: false, error: 'getProps response is not a record' };
        }

        const chatTemplate = typeof data.chat_template === 'string' ? data.chat_template : null;
        const modelAlias = typeof data.model_alias === 'string' ? data.model_alias : null;
        const isSleeping = typeof data.is_sleeping === 'boolean' ? data.is_sleeping : false;

        return {
            success: true,
            props: {
                chatTemplate,
                modelAlias,
                isSleeping
            }
        };
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

    async applyTemplate (params: ModelProviderGateway.ApplyTemplateParams): Promise<ModelProviderGateway.ApplyTemplateResult> {
        this.logger.info('Executing LlamaCppBaseGateway::applyTemplate');
        const { connection, modelId, systemPrompt, messages } = params;
        const url = this.buildUrl(connection, '/apply-template');
        const body = mapToApplyTemplateRequest({ modelId, systemPrompt, messages });

        this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - url: ', url);
        this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - body: ', JSON.stringify(body));

        const response = await this.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...this.buildAuthHeaders(connection) },
            body: JSON.stringify(body),
        });
        if (!response.success || !response.response) {
            return { success: false, error: `Error calling applyTemplate on ${url}: ${response.error}` };
        }

        this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - response: ', response.response);

        if (!response.response.ok) {
            const message = await this.parseErrorBody(response.response);
            this.logger.warning(`Executing LlamaCppBaseGateway::applyTemplate - server error ${response.response.status}: ${message}`);
            return { success: false, error: `applyTemplate failed with status ${response.response.status}: ${message}` };
        }

        const json = await this.readJson(response.response);
        if (!json.success) {
            return { success: false, error: `Error calling applyTemplate on ${url}: ${json.error}` };
        }

        const data = json.data;
        this.logger.debug('Executing LlamaCppBaseGateway::applyTemplate - data: ', data);

        if (!isRecord(data) || typeof data.prompt !== 'string') {
            this.logger.warning('Executing LlamaCppBaseGateway::applyTemplate - response without prompt');
            return { success: false, error: 'Model did not return a prompt' };
        }

        return { success: true, prompt: data.prompt };
    }

    private async request (url: string, init?: RequestInit): Promise<RequestResult> {
        try {
            return { success: true, response: await fetch(url, init) };
        } catch (error) {
            this.logger.error(`LlamaCppBaseGateway::request - fetch failed: ${url}`, error);
            return { success: false, error: this.toErrorMessage(error) };
        }
    }

    private async readJson (response: Response): Promise<ReadJsonResult> {
        try {
            return { success: true, data: await response.json() };
        } catch (error) {
            this.logger.error('LlamaCppBaseGateway::readJson - invalid JSON body', error);
            return { success: false, error: this.toErrorMessage(error) };
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
}
