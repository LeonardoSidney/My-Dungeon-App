import { STATUS_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../domain/constants/general";
import { Status } from "../../domain/entities/Status";
import { ILogger } from "../../domain/logger";
import { IStatusRepository, SaveStatusParams } from "../../domain/repository";
import { IStorage } from "../../domain/storage";
import { StatusDTO } from "../dto";

export class StatusRepository implements IStatusRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    public async saveStatus(params: SaveStatusParams): Promise<boolean> {
        this.logger.info("Executing StatusRepository::saveStatus");
        this.logger.debug("Executing StatusRepository::saveStatus - params: ", params);

        try {
            const { status } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`, status);
        } catch (error) {
            this.logger.error("Error on StatusRepository::saveStatus", error);
            throw error;
        }
        return true;
    }

    public async getStatuses(): Promise<Status[]> {
        this.logger.info("Executing StatusRepository::getStatuses");
        try {
            const statuses: Status[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`);
            this.logger.debug("Executing StatusRepository::getStatuses - rawData: ", rawData);

            if (rawData) {
                const statusesDTO: StatusDTO[] = [];
                for (const statusUnknown of rawData) {
                    const status = StatusDTO.fromStorage(statusUnknown);
                    if (status) {
                        statusesDTO.push(status);
                    }
                }

                statuses.push(...statusesDTO.map(dto => dto.toEntity()));

                if (rawData.length !== statuses.length) {
                    this.logger.warning("Some statuses were not converted to entity");
                }
            }

            this.logger.debug("Executing StatusRepository::getStatuses - statuses: ", statuses);
            return statuses || [];
        } catch (error) {
            this.logger.error("Error on StatusRepository::getStatuses", error);
            throw error;
        }
    }
}
