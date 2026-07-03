import { STORAGE_NAMESPACE, WORLD_MASTER_STORAGE_NAMESPACE } from '@domain/constants/general';
import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWorldMasterRepository, SaveWorldMasterParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { WorldMasterDTO } from '../dto';

export class WorldMasterRepository implements IWorldMasterRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveWorldMaster(params: SaveWorldMasterParams): Promise<boolean> {
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

    async getWorldMasters(): Promise<WorldMaster[]> {
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
}
