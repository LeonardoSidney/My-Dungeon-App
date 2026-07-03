import { STORAGE_NAMESPACE, WORLD_STORAGE_NAMESPACE } from '@domain/constants/general';
import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWorldRepository, SaveWorldParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { WorldDTO } from '../dto';

export class WorldRepository implements IWorldRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveWorld(params: SaveWorldParams): Promise<boolean> {
        this.logger.info('Executing WorldRepository::saveWorld');
        this.logger.debug('Executing WorldRepository::saveWorld - params: ', params);

        try {
            const { world } = params;
            const existingData = await this.storage.load<World[]>(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`);
            const worlds: World[] = existingData ? [...existingData, world] : [world];
            await this.storage.save(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`, worlds);
        } catch (error) {
            this.logger.error('Error on WorldRepository::saveWorld', error);
            throw error;
        }

        return true;
    }

    async getWorlds(): Promise<World[]> {
        this.logger.info('Executing WorldRepository::getWorlds');
        try {
            const worlds: World[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing WorldRepository::getWorlds - rawData: ', rawData);

            if (rawData) {
                const worldsDTO: WorldDTO[] = [];
                for (const worldUnknown of rawData) {
                    const world = WorldDTO.fromStorage(worldUnknown);
                    if (world) {
                        worldsDTO.push(world);
                    }
                }

                worlds.push(...worldsDTO.map((dto) => dto.toEntity()));

                if (rawData.length !== worlds.length) {
                    this.logger.warning('Some worlds were not converted to entity');
                }
            }

            this.logger.debug('Executing WorldRepository::getWorlds - worlds: ', worlds);

            return worlds;
        } catch (error) {
            this.logger.error('Error on WorldRepository getWorlds', error);
            throw error;
        }
    }
}
