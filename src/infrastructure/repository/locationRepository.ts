import { LOCATION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ILocationRepository, SaveLocationParams, EditLocationParams, EditLocationReturn, EraseLocationReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { LocationDTO } from '@infra/dto';

export class LocationRepository implements ILocationRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findLocationIndex (locations: Location[], locationId: string): Promise<number> {
        return locations.findIndex((l) => l.id === locationId);
    }

    private replaceAt (locations: Location[], index: number, newLocation: Location): Location[] {
        locations[index] = newLocation;
        return locations;
    }

    private removeAt (locations: Location[], index: number): Location[] {
        locations.splice(index, 1);
        return locations;
    }

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

    async editLocation (params: EditLocationParams): Promise<EditLocationReturn> {
        this.logger.info('Executing LocationRepository::editLocation');
        this.logger.debug('Executing LocationRepository::editLocation - params: ', params);

        try {
            const { location } = params;
            const existingData = await this.storage.load<Location[]>(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`);
            const locations = existingData || [];
            const index = await this.findLocationIndex(locations, location.id);

            if (index === -1) {
                this.logger.warning(`Location with id ${location.id} not found`);
                return { success: false, error: `Location with id ${location.id} does not exist` };
            }

            const updatedLocations = this.replaceAt(locations, index, location);
            await this.storage.save(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`, updatedLocations);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on LocationRepository::editLocation', error);
            return { success: false, error: 'Failed to edit location' };
        }
    }

    async eraseLocation (locationId: string): Promise<EraseLocationReturn> {
        this.logger.info('Executing LocationRepository::eraseLocation');
        this.logger.debug('Executing LocationRepository::eraseLocation - locationId: ', locationId);

        try {
            const existingData = await this.storage.load<Location[]>(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`);
            const locations = existingData || [];
            const index = await this.findLocationIndex(locations, locationId);

            if (index === -1) {
                this.logger.warning(`Location with id ${locationId} not found`);
                return { success: false, error: `Location with id ${locationId} does not exist` };
            }

            const filteredLocations = this.removeAt(locations, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`, filteredLocations);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on LocationRepository::eraseLocation', error);
            return { success: false, error: 'Failed to erase location' };
        }
    }
}
