import { WORLD_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IWorldRepository,
    SaveWorldParams,
    SaveWorldRepositoryReturn,
    GetWorldsRepositoryReturn,
    GetWorldByIdRepositoryReturn,
    EditWorldParams,
    EditWorldRepositoryReturn,
    EraseWorldRepositoryReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { WorldDTO } from '@infra/dto';

export class WorldRepository implements IWorldRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${WORLD_STORAGE_NAMESPACE}`;
    }

    async saveWorld (params: SaveWorldParams): Promise<SaveWorldRepositoryReturn> {
        this.logger.info('Executing WorldRepository::saveWorld');
        this.logger.storage('Executing WorldRepository::saveWorld - params: ', params);

        const loaded = await this.storage.load<World[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldRepository::saveWorld - failed to load worlds', loaded.error);
            return { success: false, error: 'Failed to save world' };
        }

        const worlds = [...(loaded.data ?? []), params.world];
        const saved = await this.storage.save(this.storageKey, worlds);
        if (!saved.success) {
            this.logger.warning('WorldRepository::saveWorld - failed to persist worlds', saved.error);
            return { success: false, error: 'Failed to save world' };
        }

        return { success: true };
    }

    async getWorldById (worldId: string): Promise<GetWorldByIdRepositoryReturn> {
        this.logger.info('Executing WorldRepository::getWorldById');

        const response = await this.getWorlds();
        if (!response.success || !response.worlds) {
            return { success: false, error: response.error };
        }

        return { success: true, world: response.worlds.find((w) => w.id === worldId) };
    }

    async getWorlds (): Promise<GetWorldsRepositoryReturn> {
        this.logger.info('Executing WorldRepository::getWorlds');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldRepository::getWorlds - failed to load worlds', loaded.error);
            return { success: false, error: 'Failed to load worlds' };
        }

        const rawData = loaded.data ?? [];
        this.logger.storage('Executing WorldRepository::getWorlds - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('WorldRepository::getWorlds - stored worlds are not a list');
            return { success: false, error: 'Failed to load worlds' };
        }

        const worlds: World[] = [];
        for (const worldUnknown of rawData) {
            const dto = WorldDTO.fromStorage(worldUnknown);
            if (dto) {
                worlds.push(dto.toEntity());
            }
        }

        if (rawData.length !== worlds.length) {
            this.logger.warning('Some worlds were not converted to entity');
        }

        this.logger.storage('Executing WorldRepository::getWorlds - worlds: ', worlds);
        return { success: true, worlds };
    }

    async editWorld (params: EditWorldParams): Promise<EditWorldRepositoryReturn> {
        this.logger.info('Executing WorldRepository::editWorld');
        this.logger.storage('Executing WorldRepository::editWorld - params: ', params);

        const { world } = params;
        const loaded = await this.storage.load<World[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldRepository::editWorld - failed to load worlds', loaded.error);
            return { success: false, error: 'Failed to edit world' };
        }

        const worlds = loaded.data ?? [];
        const index = worlds.findIndex((w) => w.id === world.id);
        if (index === -1) {
            this.logger.warning(`World with id ${world.id} not found`);
            return { success: false, error: `World with id ${world.id} does not exist` };
        }

        worlds[index] = world;
        const saved = await this.storage.save(this.storageKey, worlds);
        if (!saved.success) {
            this.logger.warning('WorldRepository::editWorld - failed to persist worlds', saved.error);
            return { success: false, error: 'Failed to edit world' };
        }

        return { success: true };
    }

    async eraseWorld (worldId: string): Promise<EraseWorldRepositoryReturn> {
        this.logger.info('Executing WorldRepository::eraseWorld');
        this.logger.debug('Executing WorldRepository::eraseWorld - worldId: ', worldId);

        const loaded = await this.storage.load<World[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('WorldRepository::eraseWorld - failed to load worlds', loaded.error);
            return { success: false, error: 'Failed to erase world' };
        }

        const worlds = loaded.data ?? [];
        const index = worlds.findIndex((w) => w.id === worldId);
        if (index === -1) {
            this.logger.warning(`World with id ${worldId} not found`);
            return { success: false, error: `World with id ${worldId} does not exist` };
        }

        worlds.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, worlds);
        if (!saved.success) {
            this.logger.warning('WorldRepository::eraseWorld - failed to persist worlds', saved.error);
            return { success: false, error: 'Failed to erase world' };
        }

        return { success: true };
    }
}
