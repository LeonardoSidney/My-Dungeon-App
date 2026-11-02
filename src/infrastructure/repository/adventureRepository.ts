import {
    ADVENTURE_INDEX_STORAGE_NAMESPACE,
    ADVENTURE_REJECTED_BACKUP_STORAGE_NAMESPACE,
    ADVENTURE_STORAGE_NAMESPACE,
    STORAGE_NAMESPACE,
} from '@domain/constants/general';
import { Adventure, AdventureIndexEntry } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IAdventureRepository,
    SaveAdventureParams,
    SaveAdventureRepositoryReturn,
    UpdateAdventureParams,
    UpdateAdventureReturn,
    GetAdventureByIdRepositoryReturn,
    GetAdventureIndexRepositoryReturn,
    GetAdventuresRepositoryReturn,
    EraseAdventuresRepositoryReturn,
    EraseAdventureReturn,
    MigrateLegacyStorageReturn,
    ParsedLegacyAdventures,
} from '@domain/repository';
import { IStorage, StorageSaveReturn } from '@domain/storage';
import { AdventureDTO, AdventureIndexEntryDTO } from '@infra/dto';

export class AdventureRepository implements IAdventureRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get legacyStorageKey (): string {
        return `${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`;
    }

    private get indexStorageKey (): string {
        return `${STORAGE_NAMESPACE}/${ADVENTURE_INDEX_STORAGE_NAMESPACE}`;
    }

    private get rejectedBackupStorageKey (): string {
        return `${STORAGE_NAMESPACE}/${ADVENTURE_REJECTED_BACKUP_STORAGE_NAMESPACE}`;
    }

    private adventureStorageKey (adventureId: string): string {
        return `${this.legacyStorageKey}/${adventureId}`;
    }

    async saveAdventure (params: SaveAdventureParams): Promise<SaveAdventureRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::saveAdventure');
        this.logger.storage('Executing AdventureRepository::saveAdventure - params: ', params);

        const { adventure } = params;
        const indexResponse = await this.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('AdventureRepository::saveAdventure - failed to load the index', indexResponse.error);
            return { success: false, error: 'Failed to save adventure' };
        }

        const saved = await this.storage.saveMany({
            [this.adventureStorageKey(adventure.id)]: adventure,
            [this.indexStorageKey]: this.withIndexEntry(indexResponse.entries, adventure),
        });
        if (!saved.success) {
            this.logger.warning('AdventureRepository::saveAdventure - failed to persist adventure', saved.error);
            return { success: false, error: 'Failed to save adventure' };
        }

        return { success: true };
    }

    async updateAdventure (params: UpdateAdventureParams): Promise<UpdateAdventureReturn> {
        this.logger.info('Executing AdventureRepository::updateAdventure');
        this.logger.storage('Executing AdventureRepository::updateAdventure - params: ', params);

        const { adventure } = params;
        const indexResponse = await this.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('AdventureRepository::updateAdventure - failed to load the index', indexResponse.error);
            return { success: false, error: 'Failed to update adventure' };
        }

        const entries = indexResponse.entries;
        const entry = entries.find((e) => e.id === adventure.id);
        if (!entry) {
            this.logger.warning(`Adventure with id ${adventure.id} not found`);
            return { success: false, error: `Adventure with id ${adventure.id} does not exist` };
        }

        const saved = await this.persistUpdate(adventure, entry, entries);
        if (!saved.success) {
            this.logger.warning('AdventureRepository::updateAdventure - failed to persist adventure', saved.error);
            return { success: false, error: 'Failed to update adventure' };
        }

        return { success: true };
    }

    async getAdventureById (adventureId: string): Promise<GetAdventureByIdRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::getAdventureById');

        const loaded = await this.storage.load<unknown>(this.adventureStorageKey(adventureId));
        if (!loaded.success) {
            this.logger.warning('AdventureRepository::getAdventureById - failed to load adventure', loaded.error);
            return { success: false, error: 'Failed to load adventure' };
        }

        if (!loaded.data) {
            return { success: true, adventure: undefined };
        }

        const dto = AdventureDTO.fromStorage(loaded.data);
        if (!dto) {
            this.logger.warning(`Adventure with id ${adventureId} was not converted to entity`);
            return { success: true, adventure: undefined };
        }

        return { success: true, adventure: dto.toEntity() };
    }

    async getAdventureIndex (): Promise<GetAdventureIndexRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::getAdventureIndex');

        const loaded = await this.storage.load<unknown>(this.indexStorageKey);
        if (!loaded.success) {
            this.logger.warning('AdventureRepository::getAdventureIndex - failed to load the index', loaded.error);
            return { success: false, error: 'Failed to load adventures' };
        }

        const rawData = loaded.data ?? [];
        this.logger.storage('Executing AdventureRepository::getAdventureIndex - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('AdventureRepository::getAdventureIndex - stored index is not a list');
            return { success: false, error: 'Failed to load adventures' };
        }

        const entries: AdventureIndexEntry[] = [];
        for (const entryUnknown of rawData) {
            const dto = AdventureIndexEntryDTO.fromStorage(entryUnknown);
            if (dto) {
                entries.push(dto.toEntity());
            }
        }

        if (rawData.length !== entries.length) {
            this.logger.warning('Some adventure index entries were not converted to entity');
        }

        return { success: true, entries };
    }

    async getAdventures (): Promise<GetAdventuresRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::getAdventures');

        const indexResponse = await this.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            return { success: false, error: indexResponse.error };
        }

        const keys = indexResponse.entries.map((entry) => this.adventureStorageKey(entry.id));
        if (keys.length === 0) {
            return { success: true, adventures: [] };
        }

        const loaded = await this.storage.loadMany<unknown>(keys);
        if (!loaded.success || !loaded.data) {
            this.logger.warning('AdventureRepository::getAdventures - failed to load adventures', loaded.error);
            return { success: false, error: 'Failed to load adventures' };
        }

        const adventures: Adventure[] = [];
        for (const key of keys) {
            const dto = AdventureDTO.fromStorage(loaded.data[key]);
            if (dto) {
                adventures.push(dto.toEntity());
            }
        }

        if (keys.length !== adventures.length) {
            this.logger.warning('Some adventures were not converted to entity');
        }

        this.logger.storage('Executing AdventureRepository::getAdventures - adventures: ', adventures);
        return { success: true, adventures };
    }

    async eraseAdventures (): Promise<EraseAdventuresRepositoryReturn> {
        this.logger.info('Executing AdventureRepository::eraseAdventures');

        const indexResponse = await this.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('AdventureRepository::eraseAdventures - failed to load the index', indexResponse.error);
            return { success: false, error: 'Failed to erase adventures' };
        }

        const adventureKeys = indexResponse.entries.map((entry) => this.adventureStorageKey(entry.id));
        const removed = await this.storage.removeMany([this.indexStorageKey, ...adventureKeys]);
        if (!removed.success) {
            this.logger.warning('AdventureRepository::eraseAdventures - failed to remove adventures', removed.error);
            return { success: false, error: 'Failed to erase adventures' };
        }

        return { success: true };
    }

    async eraseAdventure (adventureId: string): Promise<EraseAdventureReturn> {
        this.logger.info('Executing AdventureRepository::eraseAdventure');
        this.logger.debug('Executing AdventureRepository::eraseAdventure - adventureId: ', adventureId);

        const indexResponse = await this.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('AdventureRepository::eraseAdventure - failed to load the index', indexResponse.error);
            return { success: false, error: 'Failed to erase adventure' };
        }

        const entries = indexResponse.entries;
        const remaining = entries.filter((entry) => entry.id !== adventureId);
        if (remaining.length === entries.length) {
            this.logger.warning(`Adventure with id ${adventureId} not found`);
            return { success: false, error: `Adventure with id ${adventureId} does not exist` };
        }

        const saved = await this.storage.save(this.indexStorageKey, remaining);
        if (!saved.success) {
            this.logger.warning('AdventureRepository::eraseAdventure - failed to persist the index', saved.error);
            return { success: false, error: 'Failed to erase adventure' };
        }

        const removed = await this.storage.remove(this.adventureStorageKey(adventureId));
        if (!removed.success) {
            this.logger.warning('AdventureRepository::eraseAdventure - failed to remove adventure', removed.error);
            return { success: false, error: 'Failed to erase adventure' };
        }

        return { success: true };
    }

    async migrateLegacyStorage (): Promise<MigrateLegacyStorageReturn> {
        this.logger.info('Executing AdventureRepository::migrateLegacyStorage');

        const legacy = await this.storage.load<unknown>(this.legacyStorageKey);
        if (!legacy.success) {
            this.logger.warning('AdventureRepository::migrateLegacyStorage - failed to load legacy adventures', legacy.error);
            return { success: false, error: 'Failed to migrate adventures' };
        }

        if (legacy.data === null || legacy.data === undefined) {
            return { success: true };
        }

        if (!Array.isArray(legacy.data)) {
            this.logger.warning('AdventureRepository::migrateLegacyStorage - legacy adventures are not a list');
            return { success: false, error: 'Failed to migrate adventures' };
        }

        const indexResponse = await this.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('AdventureRepository::migrateLegacyStorage - failed to load the index', indexResponse.error);
            return { success: false, error: 'Failed to migrate adventures' };
        }

        const parsed = this.parseLegacyAdventures(legacy.data);
        const copied = await this.copyLegacyAdventures(parsed, indexResponse.entries);
        if (!copied.success) {
            return copied;
        }

        const removed = await this.storage.remove(this.legacyStorageKey);
        if (!removed.success) {
            this.logger.warning('AdventureRepository::migrateLegacyStorage - failed to remove legacy adventures', removed.error);
            return { success: false, error: 'Failed to migrate adventures' };
        }

        return { success: true };
    }

    private parseLegacyAdventures (rawAdventures: unknown[]): ParsedLegacyAdventures {
        const parsed: ParsedLegacyAdventures = { valid: [], rejected: [] };

        for (const raw of rawAdventures) {
            const dto = AdventureDTO.fromStorage(raw);
            if (!dto) {
                parsed.rejected.push(raw);
                continue;
            }

            parsed.valid.push({ raw, adventure: dto.toEntity() });
        }

        return parsed;
    }

    private async copyLegacyAdventures (parsed: ParsedLegacyAdventures, entries: AdventureIndexEntry[]): Promise<MigrateLegacyStorageReturn> {
        const { valid, rejected } = parsed;

        if (rejected.length > 0) {
            this.logger.warning('AdventureRepository::migrateLegacyStorage - keeping rejected adventures in a backup', rejected.length);
            const backedUp = await this.storage.save(this.rejectedBackupStorageKey, rejected);
            if (!backedUp.success) {
                this.logger.warning('AdventureRepository::migrateLegacyStorage - failed to back up rejected adventures', backedUp.error);
                return { success: false, error: 'Failed to migrate adventures' };
            }
        }

        let index = entries;
        for (const [position, { raw, adventure }] of valid.entries()) {
            index = this.withIndexEntry(index, adventure);
            const saved = await this.storage.saveMany({
                [this.adventureStorageKey(adventure.id)]: raw,
                [this.indexStorageKey]: index,
                [this.legacyStorageKey]: valid.slice(position + 1).map((remaining) => remaining.raw),
            });
            if (!saved.success) {
                this.logger.warning('AdventureRepository::migrateLegacyStorage - failed to copy adventure', saved.error);
                return { success: false, error: 'Failed to migrate adventures' };
            }
        }

        return { success: true };
    }

    private persistUpdate (adventure: Adventure, entry: AdventureIndexEntry, entries: AdventureIndexEntry[]): Promise<StorageSaveReturn> {
        const adventureKey = this.adventureStorageKey(adventure.id);
        if (this.isStreamingTick(adventure, entry)) {
            return this.storage.save(adventureKey, adventure);
        }

        return this.storage.saveMany({
            [adventureKey]: adventure,
            [this.indexStorageKey]: this.withIndexEntry(entries, adventure),
        });
    }

    private isStreamingTick (adventure: Adventure, entry: AdventureIndexEntry): boolean {
        return entry.hasStreamingChat && this.hasStreamingChat(adventure) && entry.name === adventure.name;
    }

    private hasStreamingChat (adventure: Adventure): boolean {
        return adventure.chat.some((chat) => chat.isStreaming);
    }

    private withIndexEntry (entries: AdventureIndexEntry[], adventure: Adventure): AdventureIndexEntry[] {
        const entry: AdventureIndexEntry = {
            id: adventure.id,
            name: adventure.name,
            hasStreamingChat: this.hasStreamingChat(adventure),
            createdAt: adventure.createdAt,
            updatedAt: adventure.updatedAt,
        };
        const nextEntries = [...entries];
        const position = nextEntries.findIndex((e) => e.id === adventure.id);
        if (position === -1) {
            nextEntries.push(entry);
            return nextEntries;
        }

        nextEntries[position] = entry;
        return nextEntries;
    }
}
