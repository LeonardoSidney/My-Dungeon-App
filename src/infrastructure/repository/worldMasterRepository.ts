import { WORLD_MASTER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IWorldMasterRepository,
    SaveWorldMasterParams,
    SaveWorldMasterRepositoryReturn,
    GetWorldMastersRepositoryReturn,
    GetWorldMasterByIdRepositoryReturn,
    EditWorldMasterParams,
    EditWorldMasterReturn,
    EraseWorldMasterReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { WorldMasterDTO } from '@infra/dto';

export class WorldMasterRepository implements IWorldMasterRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`;
    }

    async saveWorldMaster (params: SaveWorldMasterParams): Promise<SaveWorldMasterRepositoryReturn> {
        this.logger.info('Executing WorldMasterRepository::saveWorldMaster');
        this.logger.storage('Executing WorldMasterRepository::saveWorldMaster - params: ', params);

        const loaded = await this.storage.load<WorldMaster[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldMasterRepository::saveWorldMaster - failed to load world masters', loaded.error);
            return { success: false, error: 'Failed to save world master' };
        }

        const worldMasters = [...(loaded.data ?? []), params.worldMaster];
        const saved = await this.storage.save(this.storageKey, worldMasters);
        if (!saved.success) {
            this.logger.warning('WorldMasterRepository::saveWorldMaster - failed to persist world masters', saved.error);
            return { success: false, error: 'Failed to save world master' };
        }

        return { success: true };
    }

    async getWorldMasterById (worldMasterId: string): Promise<GetWorldMasterByIdRepositoryReturn> {
        this.logger.info('Executing WorldMasterRepository::getWorldMasterById');

        const response = await this.getWorldMasters();
        if (!response.success || !response.worldMasters) {
            return { success: false, error: response.error };
        }

        return { success: true, worldMaster: response.worldMasters.find((wm) => wm.id === worldMasterId) };
    }

    async getWorldMasters (): Promise<GetWorldMastersRepositoryReturn> {
        this.logger.info('Executing WorldMasterRepository::getWorldMasters');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldMasterRepository::getWorldMasters - failed to load world masters', loaded.error);
            return { success: false, error: 'Failed to load world masters' };
        }

        const rawData = loaded.data ?? [];
        this.logger.storage('Executing WorldMasterRepository::getWorldMasters - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('WorldMasterRepository::getWorldMasters - stored world masters are not a list');
            return { success: false, error: 'Failed to load world masters' };
        }

        const worldMasters: WorldMaster[] = [];
        for (const worldMasterUnknown of rawData) {
            const dto = WorldMasterDTO.fromStorage(worldMasterUnknown);
            if (dto) {
                worldMasters.push(dto.toEntity());
            }
        }

        if (rawData.length !== worldMasters.length) {
            this.logger.warning('Some world masters were not converted to entity');
        }

        this.logger.storage('Executing WorldMasterRepository::getWorldMasters - worldMasters: ', worldMasters);
        return { success: true, worldMasters };
    }

    async editWorldMaster (params: EditWorldMasterParams): Promise<EditWorldMasterReturn> {
        this.logger.info('Executing WorldMasterRepository::editWorldMaster');
        this.logger.storage('Executing WorldMasterRepository::editWorldMaster - params: ', params);

        const { worldMaster } = params;
        const loaded = await this.storage.load<WorldMaster[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldMasterRepository::editWorldMaster - failed to load world masters', loaded.error);
            return { success: false, error: 'Failed to edit world master' };
        }

        const worldMasters = loaded.data ?? [];
        const index = worldMasters.findIndex((wm) => wm.id === worldMaster.id);
        if (index === -1) {
            this.logger.warning(`WorldMaster with id ${worldMaster.id} not found`);
            return { success: false, error: `WorldMaster with id ${worldMaster.id} does not exist` };
        }

        worldMasters[index] = worldMaster;
        const saved = await this.storage.save(this.storageKey, worldMasters);
        if (!saved.success) {
            this.logger.warning('WorldMasterRepository::editWorldMaster - failed to persist world masters', saved.error);
            return { success: false, error: 'Failed to edit world master' };
        }

        return { success: true };
    }

    async eraseWorldMaster (worldMasterId: string): Promise<EraseWorldMasterReturn> {
        this.logger.info('Executing WorldMasterRepository::eraseWorldMaster');
        this.logger.debug('Executing WorldMasterRepository::eraseWorldMaster - worldMasterId: ', worldMasterId);

        const loaded = await this.storage.load<WorldMaster[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldMasterRepository::eraseWorldMaster - failed to load world masters', loaded.error);
            return { success: false, error: 'Failed to erase world master' };
        }

        const worldMasters = loaded.data ?? [];
        const index = worldMasters.findIndex((wm) => wm.id === worldMasterId);
        if (index === -1) {
            this.logger.warning(`WorldMaster with id ${worldMasterId} not found`);
            return { success: false, error: `WorldMaster with id ${worldMasterId} does not exist` };
        }

        worldMasters.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, worldMasters);
        if (!saved.success) {
            this.logger.warning('WorldMasterRepository::eraseWorldMaster - failed to persist world masters', saved.error);
            return { success: false, error: 'Failed to erase world master' };
        }

        return { success: true };
    }
}
