import { ADVENTURE_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAdventureRepository, SaveAdventureParams, UpdateAdventureParams, UpdateAdventureReturn, EraseAdventureReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AdventureDTO } from '@infra/dto';

export class AdventureRepository implements IAdventureRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findAdventureIndex (adventures: Adventure[], adventureId: string): Promise<number> {
        return adventures.findIndex((a) => a.id === adventureId);
    }

    private removeAt (adventures: Adventure[], index: number): Adventure[] {
        adventures.splice(index, 1);
        return adventures;
    }

    private replaceAt (adventures: Adventure[], index: number, newItem: Adventure): Adventure[] {
        adventures[index] = newItem;
        return adventures;
    }

    async saveAdventure (params: SaveAdventureParams): Promise<boolean> {
        this.logger.info('Executing AdventureRepository::saveAdventure');
        this.logger.debug('Executing AdventureRepository::saveAdventure - params: ', params);

        try {
            const { adventure } = params;
            const existingData = await this.storage.load<Adventure[]>(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`);
            const adventures: Adventure[] = existingData ? [...existingData, adventure] : [adventure];
            await this.storage.save(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`, adventures);
        } catch (error) {
            this.logger.error('Error on AdventureRepository::saveAdventure', error);
            throw error;
        }
        return true;
    }

    async updateAdventure (params: UpdateAdventureParams): Promise<UpdateAdventureReturn> {
        this.logger.info('Executing AdventureRepository::updateAdventure');
        this.logger.debug('Executing AdventureRepository::updateAdventure - params: ', params);

        try {
            const { adventure } = params;
            const existingData = await this.storage.load<Adventure[]>(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`);
            const adventures = existingData || [];
            const index = await this.findAdventureIndex(adventures, adventure.id);

            if (index === -1) {
                this.logger.warning(`Adventure with id ${adventure.id} not found`);
                return { success: false, error: `Adventure with id ${adventure.id} does not exist` };
            }

            const updatedAdventures = this.replaceAt(adventures, index, adventure);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`, updatedAdventures);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on AdventureRepository::updateAdventure', error);
            return { success: false, error: 'Failed to update adventure' };
        }
    }

    async getAdventureById (adventureId: string): Promise<Adventure | undefined> {
        this.logger.info('Executing AdventureRepository::getAdventureById');
        const adventures = await this.getAdventures();
        return adventures.find((a) => a.id === adventureId);
    }

    async getAdventures (): Promise<Adventure[]> {
        this.logger.info('Executing AdventureRepository::getAdventures');
        try {
            const adventures: Adventure[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing AdventureRepository::getAdventures - rawData: ', rawData);

            if (rawData) {
                const adventureDTO: AdventureDTO[] = [];
                for (const adventureUnknown of rawData) {
                    const adventure = AdventureDTO.fromStorage(adventureUnknown);
                    if (adventure) {
                        adventureDTO.push(adventure);
                    }
                }

                adventures.push(...adventureDTO.map(dto => dto.toEntity()));

                if (rawData.length !== adventures.length) {
                    this.logger.warning('Some adventures were not converted to entity');
                }
            }

            this.logger.debug('Executing AdventureRepository::getAdventures - adventures: ', adventures);

            return adventures;
        } catch (error) {
            this.logger.error('Error on AdventureRepository::getAdventures', error);
            throw error;
        }
    }

    async eraseAdventures (): Promise<void> {
        this.logger.info('Executing AdventureRepository::eraseAdventures');
        try {
            await this.storage.save(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`, []);
        } catch (error) {
            this.logger.error('Error on AdventureRepository::eraseAdventures', error);
            throw error;
        }
    }

    async eraseAdventure (adventureId: string): Promise<EraseAdventureReturn> {
        this.logger.info('Executing AdventureRepository::eraseAdventure');
        this.logger.debug('Executing AdventureRepository::eraseAdventure - adventureId: ', adventureId);

        try {
            const existingData = await this.storage.load<Adventure[]>(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`);
            const adventures = existingData || [];
            const index = await this.findAdventureIndex(adventures, adventureId);

            if (index === -1) {
                this.logger.warning(`Adventure with id ${adventureId} not found`);
                return { success: false, error: `Adventure with id ${adventureId} does not exist` };
            }

            const filteredAdventures = this.removeAt(adventures, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`, filteredAdventures);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on AdventureRepository::eraseAdventure', error);
            return { success: false, error: 'Failed to erase adventure' };
        }
    }
}
