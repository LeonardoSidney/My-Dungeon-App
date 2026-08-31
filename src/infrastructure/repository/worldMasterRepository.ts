import { STORAGE_NAMESPACE, WORLD_MASTER_STORAGE_NAMESPACE } from '@domain/constants/general';
import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWorldMasterRepository, SaveWorldMasterParams, EditWorldMasterParams, EditWorldMasterReturn, EraseWorldMasterReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { WorldMasterDTO } from '@infra/dto';

export class WorldMasterRepository implements IWorldMasterRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveWorldMaster (params: SaveWorldMasterParams): Promise<boolean> {
        this.logger.info('Executing WorldMasterRepository::saveWorldMaster');
        this.logger.debug('Executing WorldMasterRepository::saveWorldMaster - params: ', params);

        try {
            const { worldMaster } = params;
            const existingData = await this.storage.load<WorldMaster[]>(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`);
            const worldMasters: WorldMaster[] = existingData ? [...existingData, worldMaster] : [worldMaster];
            await this.storage.save(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`, worldMasters);
        } catch (error) {
            this.logger.error('Error on WorldMasterRepository::saveWorldMaster', error);
            throw error;
        }
        return true;
    }

    async getWorldMasterById (worldMasterId: string): Promise<WorldMaster | undefined> {
        this.logger.info('Executing WorldMasterRepository::getWorldMasterById');
        const worldMasters = await this.getWorldMasters();
        return worldMasters.find((wm) => wm.id === worldMasterId);
    }

    async getWorldMasters (): Promise<WorldMaster[]> {
        this.logger.info('Executing WorldMasterRepository::getWorldMasters');
        try {
            const worldMasters: WorldMaster[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing WorldMasterRepository::getWorldMasters - rawData: ', rawData);

            if (rawData) {
                const worldMastersDTO: WorldMasterDTO[] = [];
                for (const worldMasterUnknown of rawData) {
                    const worldMaster = WorldMasterDTO.fromStorage(worldMasterUnknown);
                    if (worldMaster) {
                        worldMastersDTO.push(worldMaster);
                    }
                }

                worldMasters.push(...worldMastersDTO.map(dto => dto.toEntity()));

                if (rawData.length !== worldMasters.length) {
                    this.logger.warning('Some world masters were not converted to entity');
                }
            }

            this.logger.debug('Executing WorldMasterRepository::getWorldMasters - worldMasters: ', worldMasters);

            return worldMasters;
        } catch (error) {
            this.logger.error('Error on WorldMasterRepository getWorldMasters', error);
            throw error;
        }
    }

    private async findWorldMasterIndex (worldMasters: WorldMaster[], worldMasterId: string): Promise<number> {
        return worldMasters.findIndex((wm) => wm.id === worldMasterId);
    }

    private removeAt (worldMasters: WorldMaster[], index: number): WorldMaster[] {
        worldMasters.splice(index, 1);
        return worldMasters;
    }

    private replaceAt (worldMasters: WorldMaster[], index: number, newItem: WorldMaster): WorldMaster[] {
        worldMasters[index] = newItem;
        return worldMasters;
    }

    async editWorldMaster (params: EditWorldMasterParams): Promise<EditWorldMasterReturn> {
        this.logger.info('Executing WorldMasterRepository::editWorldMaster');
        this.logger.debug('Executing WorldMasterRepository::editWorldMaster - params: ', params);

        try {
            const { worldMaster } = params;
            const existingData = await this.storage.load<WorldMaster[]>(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`);
            const worldMasters = existingData || [];
            const index = await this.findWorldMasterIndex(worldMasters, worldMaster.id);

            if (index === -1) {
                this.logger.warning(`World master with id ${worldMaster.id} not found`);
                return { success: false, error: `World master with id ${worldMaster.id} does not exist` };
            }

            const updatedWorldMasters = this.replaceAt(worldMasters, index, worldMaster);
            await this.storage.save(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`, updatedWorldMasters);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on WorldMasterRepository::editWorldMaster', error);
            return { success: false, error: 'Failed to edit world master' };
        }
    }

    async eraseWorldMaster (worldMasterId: string): Promise<EraseWorldMasterReturn> {
        this.logger.info('Executing WorldMasterRepository::eraseWorldMaster');
        this.logger.debug('Executing WorldMasterRepository::eraseWorldMaster - worldMasterId: ', worldMasterId);

        try {
            const existingData = await this.storage.load<WorldMaster[]>(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`);
            const worldMasters = existingData || [];
            const index = await this.findWorldMasterIndex(worldMasters, worldMasterId);

            if (index === -1) {
                this.logger.warning(`World master with id ${worldMasterId} not found`);
                return { success: false, error: `World master with id ${worldMasterId} does not exist` };
            }

            const filteredWorldMasters = this.removeAt(worldMasters, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${WORLD_MASTER_STORAGE_NAMESPACE}`, filteredWorldMasters);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on WorldMasterRepository::eraseWorldMaster', error);
            return { success: false, error: 'Failed to erase world master' };
        }
    }
}
