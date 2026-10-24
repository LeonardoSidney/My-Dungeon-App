import { STATUS_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Status } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IStatusRepository,
    SaveStatusParams,
    SaveStatusRepositoryReturn,
    GetStatusesRepositoryReturn,
    GetStatusByIdRepositoryReturn,
    EditStatusParams,
    EditStatusReturn,
    EraseStatusReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { StatusDTO } from '@infra/dto';

export class StatusRepository implements IStatusRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${STATUS_STORAGE_NAMESPACE}`;
    }

    async saveStatus (params: SaveStatusParams): Promise<SaveStatusRepositoryReturn> {
        this.logger.info('Executing StatusRepository::saveStatus');
        this.logger.debug('Executing StatusRepository::saveStatus - params: ', params);

        const loaded = await this.storage.load<Status[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('StatusRepository::saveStatus - failed to load statuses', loaded.error);
            return { success: false, error: 'Failed to save status' };
        }

        const statuses = [...(loaded.data ?? []), params.status];
        const saved = await this.storage.save(this.storageKey, statuses);
        if (!saved.success) {
            this.logger.warning('StatusRepository::saveStatus - failed to persist statuses', saved.error);
            return { success: false, error: 'Failed to save status' };
        }

        return { success: true };
    }

    async getStatusById (statusId: string): Promise<GetStatusByIdRepositoryReturn> {
        this.logger.info('Executing StatusRepository::getStatusById');

        const response = await this.getStatuses();
        if (!response.success || !response.statuses) {
            return { success: false, error: response.error };
        }

        return { success: true, status: response.statuses.find((s) => s.id === statusId) };
    }

    async getStatuses (): Promise<GetStatusesRepositoryReturn> {
        this.logger.info('Executing StatusRepository::getStatuses');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('StatusRepository::getStatuses - failed to load statuses', loaded.error);
            return { success: false, error: 'Failed to load statuses' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing StatusRepository::getStatuses - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('StatusRepository::getStatuses - stored statuses are not a list');
            return { success: false, error: 'Failed to load statuses' };
        }

        const statuses: Status[] = [];
        for (const statusUnknown of rawData) {
            const dto = StatusDTO.fromStorage(statusUnknown);
            if (dto) {
                statuses.push(dto.toEntity());
            }
        }

        if (rawData.length !== statuses.length) {
            this.logger.warning('Some statuses were not converted to entity');
        }

        this.logger.debug('Executing StatusRepository::getStatuses - statuses: ', statuses);
        return { success: true, statuses };
    }

    async editStatus (params: EditStatusParams): Promise<EditStatusReturn> {
        this.logger.info('Executing StatusRepository::editStatus');
        this.logger.debug('Executing StatusRepository::editStatus - params: ', params);

        const { status } = params;
        const loaded = await this.storage.load<Status[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('StatusRepository::editStatus - failed to load statuses', loaded.error);
            return { success: false, error: 'Failed to edit status' };
        }

        const statuses = loaded.data ?? [];
        const index = statuses.findIndex((s) => s.id === status.id);
        if (index === -1) {
            this.logger.warning(`Status with id ${status.id} not found`);
            return { success: false, error: `Status with id ${status.id} does not exist` };
        }

        statuses[index] = status;
        const saved = await this.storage.save(this.storageKey, statuses);
        if (!saved.success) {
            this.logger.warning('StatusRepository::editStatus - failed to persist statuses', saved.error);
            return { success: false, error: 'Failed to edit status' };
        }

        return { success: true };
    }

    async eraseStatus (statusId: string): Promise<EraseStatusReturn> {
        this.logger.info('Executing StatusRepository::eraseStatus');
        this.logger.debug('Executing StatusRepository::eraseStatus - statusId: ', statusId);

        const loaded = await this.storage.load<Status[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('StatusRepository::eraseStatus - failed to load statuses', loaded.error);
            return { success: false, error: 'Failed to erase status' };
        }

        const statuses = loaded.data ?? [];
        const index = statuses.findIndex((s) => s.id === statusId);
        if (index === -1) {
            this.logger.warning(`Status with id ${statusId} not found`);
            return { success: false, error: `Status with id ${statusId} does not exist` };
        }

        statuses.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, statuses);
        if (!saved.success) {
            this.logger.warning('StatusRepository::eraseStatus - failed to persist statuses', saved.error);
            return { success: false, error: 'Failed to erase status' };
        }

        return { success: true };
    }
}
