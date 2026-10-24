import { ADVENTURE_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IAdventureRepository,
    SaveAdventureParams,
    SaveAdventureRepositoryReturn,
    UpdateAdventureParams,
    UpdateAdventureReturn,
    GetAdventureByIdRepositoryReturn,
    GetAdventuresRepositoryReturn,
    EraseAdventuresRepositoryReturn,
    EraseAdventureReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AdventureDTO } from '@infra/dto';

export class AdventureRepository implements IAdventureRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`;
    }

    async saveAdventure (params: SaveAdventureParams): Promise<SaveAdventureRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::saveAdventure');
        this.logger.debug('Executing AdventureRepository::saveAdventure - params: ', params);

        const loaded = await this.storage.load<Adventure[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AdventureRepository::saveAdventure - failed to load adventures', loaded.error);
            return { success: false, error: 'Failed to save adventure' };
        }

        const adventures = [...(loaded.data ?? []), params.adventure];
        const saved = await this.storage.save(this.storageKey, adventures);
        if (!saved.success) {
            this.logger.warning('AdventureRepository::saveAdventure - failed to persist adventures', saved.error);
            return { success: false, error: 'Failed to save adventure' };
        }

        return { success: true };
    }

    async updateAdventure (params: UpdateAdventureParams): Promise<UpdateAdventureReturn> {
        this.logger.info('Executing AdventureRepository::updateAdventure');
        this.logger.debug('Executing AdventureRepository::updateAdventure - params: ', params);

        const { adventure } = params;
        const loaded = await this.storage.load<Adventure[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AdventureRepository::updateAdventure - failed to load adventures', loaded.error);
            return { success: false, error: 'Failed to update adventure' };
        }

        const adventures = loaded.data ?? [];
        const index = adventures.findIndex((a) => a.id === adventure.id);
        if (index === -1) {
            this.logger.warning(`Adventure with id ${adventure.id} not found`);
            return { success: false, error: `Adventure with id ${adventure.id} does not exist` };
        }

        adventures[index] = adventure;
        const saved = await this.storage.save(this.storageKey, adventures);
        if (!saved.success) {
            this.logger.warning('AdventureRepository::updateAdventure - failed to persist adventures', saved.error);
            return { success: false, error: 'Failed to update adventure' };
        }

        return { success: true };
    }

    async getAdventureById (adventureId: string): Promise<GetAdventureByIdRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::getAdventureById');

        const response = await this.getAdventures();
        if (!response.success || !response.adventures) {
            return { success: false, error: response.error };
        }

        return { success: true, adventure: response.adventures.find((a) => a.id === adventureId) };
    }

    async getAdventures (): Promise<GetAdventuresRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::getAdventures');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AdventureRepository::getAdventures - failed to load adventures', loaded.error);
            return { success: false, error: 'Failed to load adventures' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing AdventureRepository::getAdventures - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('AdventureRepository::getAdventures - stored adventures are not a list');
            return { success: false, error: 'Failed to load adventures' };
        }

        const adventures: Adventure[] = [];
        for (const adventureUnknown of rawData) {
            const dto = AdventureDTO.fromStorage(adventureUnknown);
            if (dto) {
                adventures.push(dto.toEntity());
            }
        }

        if (rawData.length !== adventures.length) {
            this.logger.warning('Some adventures were not converted to entity');
        }

        this.logger.debug('Executing AdventureRepository::getAdventures - adventures: ', adventures);
        return { success: true, adventures };
    }

    async eraseAdventures (): Promise<EraseAdventuresRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::eraseAdventures');

        const saved = await this.storage.save(this.storageKey, []);
        if (!saved.success) {
            this.logger.warning('AdventureRepository::eraseAdventures - failed to persist adventures', saved.error);
            return { success: false, error: 'Failed to erase adventures' };
        }

        return { success: true };
    }

    async eraseAdventure (adventureId: string): Promise<EraseAdventureReturn> {
        this.logger.info('Executing AdventureRepository::eraseAdventure');
        this.logger.debug('Executing AdventureRepository::eraseAdventure - adventureId: ', adventureId);

        const loaded = await this.storage.load<Adventure[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AdventureRepository::eraseAdventure - failed to load adventures', loaded.error);
            return { success: false, error: 'Failed to erase adventure' };
        }

        const adventures = loaded.data ?? [];
        const index = adventures.findIndex((a) => a.id === adventureId);
        if (index === -1) {
            this.logger.warning(`Adventure with id ${adventureId} not found`);
            return { success: false, error: `Adventure with id ${adventureId} does not exist` };
        }

        adventures.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, adventures);
        if (!saved.success) {
            this.logger.warning('AdventureRepository::eraseAdventure - failed to persist adventures', saved.error);
            return { success: false, error: 'Failed to erase adventure' };
        }

        return { success: true };
    }
}
