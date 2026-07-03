import { ADVENTURE_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAdventureRepository, SaveAdventureParams, UpdateAdventureParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AdventureDTO } from '../dto/adventureDTO';

export class AdventureRepository implements IAdventureRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveAdventure(params: SaveAdventureParams): Promise<boolean> {
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

    async updateAdventure(params: UpdateAdventureParams): Promise<boolean> {
        this.logger.info('Executing AdventureRepository::updateAdventure');
        this.logger.debug('Executing AdventureRepository::updateAdventure - params: ', params);

        try {
            const { adventure } = params;
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`);

            if (!rawData) {
                this.logger.error('Error on AdventureRepository::updateAdventure - No adventures found in storage');
                throw new Error('No adventures found');
            }

            const adventureDTO: AdventureDTO[] = [];
            let found = false;
            for (const adventureUnknown of rawData) {
                const dto = AdventureDTO.fromStorage(adventureUnknown);
                if (!dto) continue;

                if (dto.getId() === adventure.id) {
                    adventureDTO.push(AdventureDTO.fromEntity(adventure));
                    found = true;
                    continue;
                }

                adventureDTO.push(dto);
            }

            if (!found) {
                this.logger.error('Error on AdventureRepository::updateAdventure - Adventure not found with id: ', adventure.id);
                throw new Error(`Adventure not found with id: ${adventure.id}`);
            }

            const adventures: Adventure[] = adventureDTO.map(dto => dto.toEntity());
            await this.storage.save(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`, adventures);
        } catch (error) {
            this.logger.error('Error on AdventureRepository::updateAdventure', error);
            throw error;
        }
        return true;
    }

    async getAdventures(): Promise<Adventure[]> {
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

    async eraseAdventures(): Promise<void> {
        this.logger.info('Executing AdventureRepository::eraseAdventures');
        try {
            await this.storage.save(`${STORAGE_NAMESPACE}/${ADVENTURE_STORAGE_NAMESPACE}`, []);
        } catch (error) {
            this.logger.error('Error on AdventureRepository::eraseAdventures', error);
            throw error;
        }
    }
}
