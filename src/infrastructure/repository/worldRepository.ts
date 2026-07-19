import { STORAGE_NAMESPACE, WORLD_STORAGE_NAMESPACE } from '@domain/constants/general';
import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWorldRepository, SaveWorldParams, EraseWorldRepositoryReturn, EditWorldRepositoryReturn, EditWorldParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { WorldDTO } from '../dto';

export class WorldRepository implements IWorldRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findWorldIndex (worlds: World[], worldId: string): Promise<number> {
        return worlds.findIndex((w) => w.id === worldId);
    }

    private removeAt (worlds: World[], index: number): World[] {
        worlds.splice(index, 1);
        return worlds;
    }

    private replaceAt (worlds: World[], index: number, newItem: World): World[] {
        worlds[index] = newItem;
        return worlds;
    }

    async saveWorld (params: SaveWorldParams): Promise<boolean> {
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

    async getWorlds (): Promise<World[]> {
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

    async eraseWorld (worldId: string): Promise<EraseWorldRepositoryReturn> {
        this.logger.info('Executing WorldRepository::eraseWorld');
        this.logger.debug('Executing WorldRepository::eraseWorld - worldId: ', worldId);

        try {
            const existingData = await this.storage.load<World[]>(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`);
            const worlds = existingData || [];
            const index = await this.findWorldIndex(worlds, worldId);

            if (index === -1) {
                this.logger.warning(`World with id ${worldId} not found`);
                return { success: false, error: `World with id ${worldId} does not exist` };
            }

            const filteredWorlds = this.removeAt(worlds, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`, filteredWorlds);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on WorldRepository::eraseWorld', error);
            return { success: false, error: 'Failed to erase world' };
        }
    }

    async editWorld (params: EditWorldParams): Promise<EditWorldRepositoryReturn> {
        this.logger.info('Executing WorldRepository::editWorld');
        this.logger.debug('Executing WorldRepository::editWorld - params: ', params);

        try {
            const { world } = params;
            const existingData = await this.storage.load<World[]>(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`);
            const worlds = existingData || [];
            const index = await this.findWorldIndex(worlds, world.id);

            if (index === -1) {
                this.logger.warning(`World with id ${world.id} not found`);
                return { success: false, error: `World with id ${world.id} does not exist` };
            }

            const updatedWorlds = this.replaceAt(worlds, index, world);
            await this.storage.save(`${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`, updatedWorlds);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on WorldRepository::editWorld', error);
            return { success: false, error: 'Failed to edit world' };
        }
    }
}
