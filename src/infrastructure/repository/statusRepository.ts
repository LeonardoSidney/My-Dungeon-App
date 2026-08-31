import { STATUS_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Status } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStatusRepository, SaveStatusParams, EditStatusParams, EditStatusReturn, EraseStatusReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { StatusDTO } from '@infra/dto';

export class StatusRepository implements IStatusRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findStatusIndex (statuses: Status[], statusId: string): Promise<number> {
        return statuses.findIndex((s) => s.id === statusId);
    }

    private replaceAt (statuses: Status[], index: number, newItem: Status): Status[] {
        statuses[index] = newItem;
        return statuses;
    }

    private removeAt (statuses: Status[], index: number): Status[] {
        statuses.splice(index, 1);
        return statuses;
    }

    async saveStatus (params: SaveStatusParams): Promise<boolean> {
        this.logger.info('Executing StatusRepository::saveStatus');
        this.logger.debug('Executing StatusRepository::saveStatus - params: ', params);

        try {
            const { status } = params;
            const existingData = await this.storage.load<Status[]>(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`);
            const statuses: Status[] = existingData ? [...existingData, status] : [status];
            await this.storage.save(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`, statuses);
        } catch (error) {
            this.logger.error('Error on StatusRepository::saveStatus', error);
            throw error;
        }
        return true;
    }

    async getStatusById (statusId: string): Promise<Status | undefined> {
        this.logger.info('Executing StatusRepository::getStatusById');
        const statuses = await this.getStatuses();
        return statuses.find((s) => s.id === statusId);
    }

    async getStatuses (): Promise<Status[]> {
        this.logger.info('Executing StatusRepository::getStatuses');
        try {
            const statuses: Status[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing StatusRepository::getStatuses - rawData: ', rawData);

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
                    this.logger.warning('Some statuses were not converted to entity');
                }
            }

            this.logger.debug('Executing StatusRepository::getStatuses - statuses: ', statuses);
            return statuses || [];
        } catch (error) {
            this.logger.error('Error on StatusRepository::getStatuses', error);
            throw error;
        }
    }

    async editStatus (params: EditStatusParams): Promise<EditStatusReturn> {
        this.logger.info('Executing StatusRepository::editStatus');
        this.logger.debug('Executing StatusRepository::editStatus - params: ', params);

        try {
            const { status } = params;
            const existingData = await this.storage.load<Status[]>(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`);
            const statuses = existingData || [];
            const index = await this.findStatusIndex(statuses, status.id);

            if (index === -1) {
                this.logger.warning(`Status with id ${status.id} not found`);
                return { success: false, error: `Status with id ${status.id} does not exist` };
            }

            const updatedStatuses = this.replaceAt(statuses, index, status);
            await this.storage.save(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`, updatedStatuses);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on StatusRepository::editStatus', error);
            return { success: false, error: 'Failed to edit status' };
        }
    }

    async eraseStatus (statusId: string): Promise<EraseStatusReturn> {
        this.logger.info('Executing StatusRepository::eraseStatus');
        this.logger.debug('Executing StatusRepository::eraseStatus - statusId: ', statusId);

        try {
            const existingData = await this.storage.load<Status[]>(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`);
            const statuses = existingData || [];
            const index = await this.findStatusIndex(statuses, statusId);

            if (index === -1) {
                this.logger.warning(`Status with id ${statusId} not found`);
                return { success: false, error: `Status with id ${statusId} does not exist` };
            }

            const filteredStatuses = this.removeAt(statuses, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`, filteredStatuses);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on StatusRepository::eraseStatus', error);
            return { success: false, error: 'Failed to erase status' };
        }
    }
}
