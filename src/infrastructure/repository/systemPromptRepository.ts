import { STORAGE_NAMESPACE, SYSTEM_PROMPT_STORAGE_NAMESPACE } from '@domain/constants/general';
import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { ISystemPromptRepository, SaveSystemPromptParams } from '@domain/repository';
import { SystemPromptDTO } from '../dto';

export class SystemPromptRepository implements ISystemPromptRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveSystemPrompt(params: SaveSystemPromptParams): Promise<boolean> {
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

    async getSystemPrompts(): Promise<SystemPrompt[]> {
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

            return systemPrompts;
        } catch (error) {
            this.logger.error('Error on SystemPromptRepository getSystemPrompts', error);
            throw error;
        }
    }
}
