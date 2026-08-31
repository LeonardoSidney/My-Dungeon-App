import { STORAGE_NAMESPACE, SYSTEM_PROMPT_STORAGE_NAMESPACE } from '@domain/constants/general';
import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { ISystemPromptRepository, SaveSystemPromptParams, EditSystemPromptParams, EditSystemPromptReturn, EraseSystemPromptReturn } from '@domain/repository';
import { SystemPromptDTO } from '../dto';

export class SystemPromptRepository implements ISystemPromptRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findSystemPromptIndex (systemPrompts: SystemPrompt[], systemPromptId: string): Promise<number> {
        return systemPrompts.findIndex((sp) => sp.id === systemPromptId);
    }

    private replaceAt (systemPrompts: SystemPrompt[], index: number, newItem: SystemPrompt): SystemPrompt[] {
        systemPrompts[index] = newItem;
        return systemPrompts;
    }

    private removeAt (systemPrompts: SystemPrompt[], index: number): SystemPrompt[] {
        systemPrompts.splice(index, 1);
        return systemPrompts;
    }

    async saveSystemPrompt (params: SaveSystemPromptParams): Promise<boolean> {
        this.logger.info('Executing SystemPromptRepository::saveSystemPrompt');
        this.logger.debug('Executing SystemPromptRepository::saveSystemPrompt - params: ', params);

        try {
            const { systemPrompt } = params;
            const existingData = await this.storage.load<SystemPrompt[]>(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`);
            const systemPrompts: SystemPrompt[] = existingData ? [...existingData, systemPrompt] : [systemPrompt];
            await this.storage.save(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`, systemPrompts);
        } catch (error) {
            this.logger.error('Error on SystemPromptRepository::saveSystemPrompt', error);
            throw error;
        }

        return true;
    }

    async getSystemPromptById (systemPromptId: string): Promise<SystemPrompt | undefined> {
        this.logger.info('Executing SystemPromptRepository::getSystemPromptById');
        const systemPrompts = await this.getSystemPrompts();
        return systemPrompts.find((sp) => sp.id === systemPromptId);
    }

    async getSystemPrompts (): Promise<SystemPrompt[]> {
        this.logger.info('Executing SystemPromptRepository::getSystemPrompts');
        try {
            const systemPrompts: SystemPrompt[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing SystemPromptRepository::getSystemPrompts - rawData: ', rawData);

            if (rawData) {
                const systemPromptsDTO: SystemPromptDTO[] = [];
                for (const systemPromptUnknown of rawData) {
                    const systemPrompt = SystemPromptDTO.fromStorage(systemPromptUnknown);
                    if (systemPrompt) {
                        systemPromptsDTO.push(systemPrompt);
                    }
                }

                systemPrompts.push(...systemPromptsDTO.map((dto) => dto.toEntity()));

                if (rawData.length !== systemPrompts.length) {
                    this.logger.warning('Some system prompts were not converted to entity');
                }
            }

            this.logger.debug('Executing SystemPromptRepository::getSystemPrompts - systemPrompts: ', systemPrompts);

            return systemPrompts || [];
        } catch (error) {
            this.logger.error('Error on SystemPromptRepository getSystemPrompts', error);
            throw error;
        }
    }

    async editSystemPrompt (params: EditSystemPromptParams): Promise<EditSystemPromptReturn> {
        this.logger.info('Executing SystemPromptRepository::editSystemPrompt');
        this.logger.debug('Executing SystemPromptRepository::editSystemPrompt - params: ', params);

        try {
            const { systemPrompt } = params;
            const existingData = await this.storage.load<SystemPrompt[]>(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`);
            const systemPrompts = existingData || [];
            const index = await this.findSystemPromptIndex(systemPrompts, systemPrompt.id);

            if (index === -1) {
                this.logger.warning(`System prompt with id ${systemPrompt.id} not found`);
                return { success: false, error: `System prompt with id ${systemPrompt.id} does not exist` };
            }

            const updatedSystemPrompts = this.replaceAt(systemPrompts, index, systemPrompt);
            await this.storage.save(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`, updatedSystemPrompts);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on SystemPromptRepository::editSystemPrompt', error);
            return { success: false, error: 'Failed to edit system prompt' };
        }
    }

    async eraseSystemPrompt (systemPromptId: string): Promise<EraseSystemPromptReturn> {
        this.logger.info('Executing SystemPromptRepository::eraseSystemPrompt');
        this.logger.debug('Executing SystemPromptRepository::eraseSystemPrompt - systemPromptId: ', systemPromptId);

        try {
            const existingData = await this.storage.load<SystemPrompt[]>(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`);
            const systemPrompts = existingData || [];
            const index = await this.findSystemPromptIndex(systemPrompts, systemPromptId);

            if (index === -1) {
                this.logger.warning(`System prompt with id ${systemPromptId} not found`);
                return { success: false, error: `System prompt with id ${systemPromptId} does not exist` };
            }

            const updatedSystemPrompts = this.removeAt(systemPrompts, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${SYSTEM_PROMPT_STORAGE_NAMESPACE}`, updatedSystemPrompts);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on SystemPromptRepository::eraseSystemPrompt', error);
            return { success: false, error: 'Failed to erase system prompt' };
        }
    }
}
