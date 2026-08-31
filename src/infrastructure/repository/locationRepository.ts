import { LOCATION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ILocationRepository, SaveLocationParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { LocationDTO } from '@infra/dto';

export class LocationRepository implements ILocationRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveLocation (params: SaveLocationParams): Promise<boolean> {
        this.logger.info('Executing LocationRepository::saveLocation');
        this.logger.debug('Executing LocationRepository::saveLocation - params: ', params);

        try {
            const { location } = params;
            const existingData = await this.storage.load<Location[]>(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`);
            const locations: Location[] = existingData ? [...existingData, location] : [location];
            await this.storage.save(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`, locations);
        } catch (error) {
            this.logger.error('Error on LocationRepository::saveLocation', error);
            throw error;
        }

        return true;
    }

    async getLocationById (locationId: string): Promise<Location | undefined> {
        this.logger.info('Executing LocationRepository::getLocationById');
        const locations = await this.getLocations();
        return locations.find((l) => l.id === locationId);
    }

    async getLocations (): Promise<Location[]> {
        this.logger.info('Executing LocationRepository::getLocations');
        try {
            const locations: Location[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing LocationRepository::getLocations - rawData: ', rawData);

            if (rawData) {
                const locationsDTO: LocationDTO[] = [];
                for (const locationUnknown of rawData) {
                    const location = LocationDTO.fromStorage(locationUnknown);
                    if (location) {
                        locationsDTO.push(location);
                    }
                }

                locations.push(...locationsDTO.map((dto) => dto.toEntity()));

                if (rawData.length !== locations.length) {
                    this.logger.warning('Some locations were not converted to entity');
                }
            }

            this.logger.debug('Executing LocationRepository::getLocations - locations: ', locations);

            return locations;
        } catch (error) {
            this.logger.error('Error on LocationRepository getLocations', error);
            throw error;
        }
    }
}
