import { ASSISTANT_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../domain/constants/general";
import { Assistant } from "../../domain/entities";
import { ILogger } from "../../domain/logger";
import { IAssistantRepository, SaveAssistantParams } from "../../domain/repository";
import { IStorage } from "../../domain/storage";
import { AssistantDTO } from "../dto";

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
            const assistants: Assistant[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ASSISTANT_STORAGE_NAMESPACE}`);
            this.logger.debug("Executing AssistantRepository::getAssistants - rawData: ", rawData);

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
                    this.logger.warning("Some assistants were not converted to entity");
                }
            }

            this.logger.debug("Executing AssistantRepository::getAssistants - assistants: ", assistants);
            return assistants || [];
        } catch (error) {
            this.logger.error("Error on AssistantRepository::getAssistants", error);
            throw error;
        }
    }
}
