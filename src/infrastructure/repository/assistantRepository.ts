import { ASSISTANT_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../domain/constants/general";
import { Assistant } from "../../domain/entities";
import { ILogger } from "../../domain/logger";
import { IAssistantRepository, SaveAssistantParams } from "../../domain/repository";
import { IStorage } from "../../domain/storage";

export class AssistantRepository implements IAssistantRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    public async saveAssistant(params: SaveAssistantParams): Promise<boolean> {
        this.logger.info("Executing AssistantRepository::saveAssistant");
        this.logger.debug("Executing AssistantRepository::saveAssistant - params: ", params);

        try {
            const { assistant } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`, assistant);
        } catch (error) {
            this.logger.error("Error on AssistantRepository::saveAssistant", error);
            throw error;
        }
        return true;
    }

    public async getAssistants(): Promise<Assistant[]> {
        this.logger.info("Executing AssistantRepository::getAssistants");
        try {
            const assistants = await this.storage.load<Assistant[]>(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`);
            this.logger.debug("Executing AssistantRepository::getAssistants - assistants: ", assistants);
            return assistants || [];
        } catch (error) {
            this.logger.error("Error on AssistantRepository getAssistants", error);
            throw error;
        }
    }
}
