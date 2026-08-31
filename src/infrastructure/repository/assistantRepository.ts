import { ASSISTANT_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Assistant } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAssistantRepository, SaveAssistantParams, EditAssistantParams, EditAssistantReturn, EraseAssistantReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AssistantDTO } from '@infra/dto';

export class AssistantRepository implements IAssistantRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findAssistantIndex (assistants: Assistant[], assistantId: string): Promise<number> {
        return assistants.findIndex((a) => a.id === assistantId);
    }

    private removeAt (assistants: Assistant[], index: number): Assistant[] {
        assistants.splice(index, 1);
        return assistants;
    }

    private replaceAt (assistants: Assistant[], index: number, newItem: Assistant): Assistant[] {
        assistants[index] = newItem;
        return assistants;
    }

    async saveAssistant (params: SaveAssistantParams): Promise<boolean> {
        this.logger.info('Executing AssistantRepository::saveAssistant');
        this.logger.debug('Executing AssistantRepository::saveAssistant - params: ', params);

        try {
            const { assistant } = params;
            const existingData = await this.storage.load<Assistant[]>(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`);
            const assistants: Assistant[] = existingData ? [...existingData, assistant] : [assistant];
            await this.storage.save(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`, assistants);
        } catch (error) {
            this.logger.error('Error on AssistantRepository::saveAssistant', error);
            throw error;
        }
        return true;
    }

    async getAssistantById (assistantId: string): Promise<Assistant | undefined> {
        this.logger.info('Executing AssistantRepository::getAssistantById');
        const assistants = await this.getAssistants();
        return assistants.find((a) => a.id === assistantId);
    }

    async getAssistants (): Promise<Assistant[]> {
        this.logger.info('Executing AssistantRepository::getAssistants');
        try {
            const assistants: Assistant[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing AssistantRepository::getAssistants - rawData: ', rawData);

            if (rawData) {
                const assistantsDTO: AssistantDTO[] = [];
                for (const assistantUnknown of rawData) {
                    const assistant = AssistantDTO.fromStorage(assistantUnknown);
                    if (assistant) {
                        assistantsDTO.push(assistant);
                    }
                }

                assistants.push(...assistantsDTO.map(dto => dto.toEntity()));

                if (rawData.length !== assistants.length) {
                    this.logger.warning('Some assistants were not converted to entity');
                }
            }

            this.logger.debug('Executing AssistantRepository::getAssistants - assistants: ', assistants);
            return assistants || [];
        } catch (error) {
            this.logger.error('Error on AssistantRepository::getAssistants', error);
            throw error;
        }
    }

    async editAssistant (params: EditAssistantParams): Promise<EditAssistantReturn> {
        this.logger.info('Executing AssistantRepository::editAssistant');
        this.logger.debug('Executing AssistantRepository::editAssistant - params: ', params);

        try {
            const { assistant } = params;
            const existingData = await this.storage.load<Assistant[]>(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`);
            const assistants = existingData || [];
            const index = await this.findAssistantIndex(assistants, assistant.id);

            if (index === -1) {
                this.logger.warning(`Assistant with id ${assistant.id} not found`);
                return { success: false, error: `Assistant with id ${assistant.id} does not exist` };
            }

            const updatedAssistants = this.replaceAt(assistants, index, assistant);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`, updatedAssistants);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on AssistantRepository::editAssistant', error);
            return { success: false, error: 'Failed to edit assistant' };
        }
    }

    async eraseAssistant (assistantId: string): Promise<EraseAssistantReturn> {
        this.logger.info('Executing AssistantRepository::eraseAssistant');
        this.logger.debug('Executing AssistantRepository::eraseAssistant - assistantId: ', assistantId);

        try {
            const existingData = await this.storage.load<Assistant[]>(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`);
            const assistants = existingData || [];
            const index = await this.findAssistantIndex(assistants, assistantId);

            if (index === -1) {
                this.logger.warning(`Assistant with id ${assistantId} not found`);
                return { success: false, error: `Assistant with id ${assistantId} does not exist` };
            }

            const filteredAssistants = this.removeAt(assistants, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`, filteredAssistants);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on AssistantRepository::eraseAssistant', error);
            return { success: false, error: 'Failed to erase assistant' };
        }
    }
}
