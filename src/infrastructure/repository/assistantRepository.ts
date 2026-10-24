import { ASSISTANT_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Assistant } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    SaveAssistantParams,
    SaveAssistantRepositoryReturn,
    GetAssistantsRepositoryReturn,
    GetAssistantByIdRepositoryReturn,
    EditAssistantParams,
    EditAssistantReturn,
    EraseAssistantReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AssistantDTO } from '@infra/dto';

export class AssistantRepository implements IAssistantRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`;
    }

    async saveAssistant (params: SaveAssistantParams): Promise<SaveAssistantRepositoryReturn> {
        this.logger.info('Executing AssistantRepository::saveAssistant');
        this.logger.debug('Executing AssistantRepository::saveAssistant - params: ', params);

        const loaded = await this.storage.load<Assistant[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AssistantRepository::saveAssistant - failed to load assistants', loaded.error);
            return { success: false, error: 'Failed to save assistant' };
        }

        const assistants = [...(loaded.data ?? []), params.assistant];
        const saved = await this.storage.save(this.storageKey, assistants);
        if (!saved.success) {
            this.logger.warning('AssistantRepository::saveAssistant - failed to persist assistants', saved.error);
            return { success: false, error: 'Failed to save assistant' };
        }

        return { success: true };
    }

    async getAssistantById (assistantId: string): Promise<GetAssistantByIdRepositoryReturn> {
        this.logger.info('Executing AssistantRepository::getAssistantById');

        const response = await this.getAssistants();
        if (!response.success || !response.assistants) {
            return { success: false, error: response.error };
        }

        return { success: true, assistant: response.assistants.find((a) => a.id === assistantId) };
    }

    async getAssistants (): Promise<GetAssistantsRepositoryReturn> {
        this.logger.info('Executing AssistantRepository::getAssistants');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AssistantRepository::getAssistants - failed to load assistants', loaded.error);
            return { success: false, error: 'Failed to load assistants' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing AssistantRepository::getAssistants - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('AssistantRepository::getAssistants - stored assistants are not a list');
            return { success: false, error: 'Failed to load assistants' };
        }

        const assistants: Assistant[] = [];
        for (const assistantUnknown of rawData) {
            const dto = AssistantDTO.fromStorage(assistantUnknown);
            if (dto) {
                assistants.push(dto.toEntity());
            }
        }

        if (rawData.length !== assistants.length) {
            this.logger.warning('Some assistants were not converted to entity');
        }

        this.logger.debug('Executing AssistantRepository::getAssistants - assistants: ', assistants);
        return { success: true, assistants };
    }

    async editAssistant (params: EditAssistantParams): Promise<EditAssistantReturn> {
        this.logger.info('Executing AssistantRepository::editAssistant');
        this.logger.debug('Executing AssistantRepository::editAssistant - params: ', params);

        const { assistant } = params;
        const loaded = await this.storage.load<Assistant[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AssistantRepository::editAssistant - failed to load assistants', loaded.error);
            return { success: false, error: 'Failed to edit assistant' };
        }

        const assistants = loaded.data ?? [];
        const index = assistants.findIndex((a) => a.id === assistant.id);
        if (index === -1) {
            this.logger.warning(`Assistant with id ${assistant.id} not found`);
            return { success: false, error: `Assistant with id ${assistant.id} does not exist` };
        }

        assistants[index] = assistant;
        const saved = await this.storage.save(this.storageKey, assistants);
        if (!saved.success) {
            this.logger.warning('AssistantRepository::editAssistant - failed to persist assistants', saved.error);
            return { success: false, error: 'Failed to edit assistant' };
        }

        return { success: true };
    }

    async eraseAssistant (assistantId: string): Promise<EraseAssistantReturn> {
        this.logger.info('Executing AssistantRepository::eraseAssistant');
        this.logger.debug('Executing AssistantRepository::eraseAssistant - assistantId: ', assistantId);

        const loaded = await this.storage.load<Assistant[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AssistantRepository::eraseAssistant - failed to load assistants', loaded.error);
            return { success: false, error: 'Failed to erase assistant' };
        }

        const assistants = loaded.data ?? [];
        const index = assistants.findIndex((a) => a.id === assistantId);
        if (index === -1) {
            this.logger.warning(`Assistant with id ${assistantId} not found`);
            return { success: false, error: `Assistant with id ${assistantId} does not exist` };
        }

        assistants.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, assistants);
        if (!saved.success) {
            this.logger.warning('AssistantRepository::eraseAssistant - failed to persist assistants', saved.error);
            return { success: false, error: 'Failed to erase assistant' };
        }

        return { success: true };
    }
}
