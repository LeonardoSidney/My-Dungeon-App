import { SYSTEM_PROMPT_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ISystemPromptRepository,
    SaveSystemPromptParams,
    SaveSystemPromptRepositoryReturn,
    GetSystemPromptsRepositoryReturn,
    GetSystemPromptByIdRepositoryReturn,
    EditSystemPromptParams,
    EditSystemPromptReturn,
    EraseSystemPromptReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { SystemPromptDTO } from '@infra/dto';

export class SystemPromptRepository implements ISystemPromptRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`;
    }

    async saveSystemPrompt (params: SaveSystemPromptParams): Promise<SaveSystemPromptRepositoryReturn> {
        this.logger.info('Executing SystemPromptRepository::saveSystemPrompt');
        this.logger.debug('Executing SystemPromptRepository::saveSystemPrompt - params: ', params);

        const loaded = await this.storage.load<SystemPrompt[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SystemPromptRepository::saveSystemPrompt - failed to load system prompts', loaded.error);
            return { success: false, error: 'Failed to save system prompt' };
        }

        const systemPrompts = [...(loaded.data ?? []), params.systemPrompt];
        const saved = await this.storage.save(this.storageKey, systemPrompts);
        if (!saved.success) {
            this.logger.warning('SystemPromptRepository::saveSystemPrompt - failed to persist system prompts', saved.error);
            return { success: false, error: 'Failed to save system prompt' };
        }

        return { success: true };
    }

    async getSystemPromptById (systemPromptId: string): Promise<GetSystemPromptByIdRepositoryReturn> {
        this.logger.info('Executing SystemPromptRepository::getSystemPromptById');

        const response = await this.getSystemPrompts();
        if (!response.success || !response.systemPrompts) {
            return { success: false, error: response.error };
        }

        return { success: true, systemPrompt: response.systemPrompts.find((sp) => sp.id === systemPromptId) };
    }

    async getSystemPrompts (): Promise<GetSystemPromptsRepositoryReturn> {
        this.logger.info('Executing SystemPromptRepository::getSystemPrompts');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SystemPromptRepository::getSystemPrompts - failed to load system prompts', loaded.error);
            return { success: false, error: 'Failed to load system prompts' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing SystemPromptRepository::getSystemPrompts - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('SystemPromptRepository::getSystemPrompts - stored system prompts are not a list');
            return { success: false, error: 'Failed to load system prompts' };
        }

        const systemPrompts: SystemPrompt[] = [];
        for (const systemPromptUnknown of rawData) {
            const dto = SystemPromptDTO.fromStorage(systemPromptUnknown);
            if (dto) {
                systemPrompts.push(dto.toEntity());
            }
        }

        if (rawData.length !== systemPrompts.length) {
            this.logger.warning('Some system prompts were not converted to entity');
        }

        this.logger.debug('Executing SystemPromptRepository::getSystemPrompts - systemPrompts: ', systemPrompts);
        return { success: true, systemPrompts };
    }

    async editSystemPrompt (params: EditSystemPromptParams): Promise<EditSystemPromptReturn> {
        this.logger.info('Executing SystemPromptRepository::editSystemPrompt');
        this.logger.debug('Executing SystemPromptRepository::editSystemPrompt - params: ', params);

        const { systemPrompt } = params;
        const loaded = await this.storage.load<SystemPrompt[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SystemPromptRepository::editSystemPrompt - failed to load system prompts', loaded.error);
            return { success: false, error: 'Failed to edit system prompt' };
        }

        const systemPrompts = loaded.data ?? [];
        const index = systemPrompts.findIndex((sp) => sp.id === systemPrompt.id);
        if (index === -1) {
            this.logger.warning(`SystemPrompt with id ${systemPrompt.id} not found`);
            return { success: false, error: `SystemPrompt with id ${systemPrompt.id} does not exist` };
        }

        systemPrompts[index] = systemPrompt;
        const saved = await this.storage.save(this.storageKey, systemPrompts);
        if (!saved.success) {
            this.logger.warning('SystemPromptRepository::editSystemPrompt - failed to persist system prompts', saved.error);
            return { success: false, error: 'Failed to edit system prompt' };
        }

        return { success: true };
    }

    async eraseSystemPrompt (systemPromptId: string): Promise<EraseSystemPromptReturn> {
        this.logger.info('Executing SystemPromptRepository::eraseSystemPrompt');
        this.logger.debug('Executing SystemPromptRepository::eraseSystemPrompt - systemPromptId: ', systemPromptId);

        const loaded = await this.storage.load<SystemPrompt[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SystemPromptRepository::eraseSystemPrompt - failed to load system prompts', loaded.error);
            return { success: false, error: 'Failed to erase system prompt' };
        }

        const systemPrompts = loaded.data ?? [];
        const index = systemPrompts.findIndex((sp) => sp.id === systemPromptId);
        if (index === -1) {
            this.logger.warning(`SystemPrompt with id ${systemPromptId} not found`);
            return { success: false, error: `SystemPrompt with id ${systemPromptId} does not exist` };
        }

        systemPrompts.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, systemPrompts);
        if (!saved.success) {
            this.logger.warning('SystemPromptRepository::eraseSystemPrompt - failed to persist system prompts', saved.error);
            return { success: false, error: 'Failed to erase system prompt' };
        }

        return { success: true };
    }
}
