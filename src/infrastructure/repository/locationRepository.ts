import { LOCATION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ILocationRepository,
    SaveLocationParams,
    SaveLocationRepositoryReturn,
    GetLocationsRepositoryReturn,
    GetLocationByIdRepositoryReturn,
    EditLocationParams,
    EditLocationReturn,
    EraseLocationReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { LocationDTO } from '@infra/dto';

export class LocationRepository implements ILocationRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${LOCATION_STORAGE_NAMESPACE}`;
    }

    async saveLocation (params: SaveLocationParams): Promise<SaveLocationRepositoryReturn> {
        this.logger.info('Executing LocationRepository::saveLocation');
        this.logger.storage('Executing LocationRepository::saveLocation - params: ', params);

        const loaded = await this.storage.load<Location[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('LocationRepository::saveLocation - failed to load locations', loaded.error);
            return { success: false, error: 'Failed to save location' };
        }

        const locations = [...(loaded.data ?? []), params.location];
        const saved = await this.storage.save(this.storageKey, locations);
        if (!saved.success) {
            this.logger.warning('LocationRepository::saveLocation - failed to persist locations', saved.error);
            return { success: false, error: 'Failed to save location' };
        }

        return { success: true };
    }

    async getLocationById (locationId: string): Promise<GetLocationByIdRepositoryReturn> {
        this.logger.info('Executing LocationRepository::getLocationById');

        const response = await this.getLocations();
        if (!response.success || !response.locations) {
            return { success: false, error: response.error };
        }

        return { success: true, location: response.locations.find((l) => l.id === locationId) };
    }

    async getLocations (): Promise<GetLocationsRepositoryReturn> {
        this.logger.info('Executing LocationRepository::getLocations');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('LocationRepository::getLocations - failed to load locations', loaded.error);
            return { success: false, error: 'Failed to load locations' };
        }

        const rawData = loaded.data ?? [];
        this.logger.storage('Executing LocationRepository::getLocations - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('LocationRepository::getLocations - stored locations are not a list');
            return { success: false, error: 'Failed to load locations' };
        }

        const locations: Location[] = [];
        for (const locationUnknown of rawData) {
            const dto = LocationDTO.fromStorage(locationUnknown);
            if (dto) {
                locations.push(dto.toEntity());
            }
        }

        if (rawData.length !== locations.length) {
            this.logger.warning('Some locations were not converted to entity');
        }

        this.logger.storage('Executing LocationRepository::getLocations - locations: ', locations);
        return { success: true, locations };
    }

    async editLocation (params: EditLocationParams): Promise<EditLocationReturn> {
        this.logger.info('Executing LocationRepository::editLocation');
        this.logger.storage('Executing LocationRepository::editLocation - params: ', params);

        const { location } = params;
        const loaded = await this.storage.load<Location[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('LocationRepository::editLocation - failed to load locations', loaded.error);
            return { success: false, error: 'Failed to edit location' };
        }

        const locations = loaded.data ?? [];
        const index = locations.findIndex((l) => l.id === location.id);
        if (index === -1) {
            this.logger.warning(`Location with id ${location.id} not found`);
            return { success: false, error: `Location with id ${location.id} does not exist` };
        }

        locations[index] = location;
        const saved = await this.storage.save(this.storageKey, locations);
        if (!saved.success) {
            this.logger.warning('LocationRepository::editLocation - failed to persist locations', saved.error);
            return { success: false, error: 'Failed to edit location' };
        }

        return { success: true };
    }

    async eraseLocation (locationId: string): Promise<EraseLocationReturn> {
        this.logger.info('Executing LocationRepository::eraseLocation');
        this.logger.debug('Executing LocationRepository::eraseLocation - locationId: ', locationId);

        const loaded = await this.storage.load<Location[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('LocationRepository::eraseLocation - failed to load locations', loaded.error);
            return { success: false, error: 'Failed to erase location' };
        }

        const locations = loaded.data ?? [];
        const index = locations.findIndex((l) => l.id === locationId);
        if (index === -1) {
            this.logger.warning(`Location with id ${locationId} not found`);
            return { success: false, error: `Location with id ${locationId} does not exist` };
        }

        locations.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, locations);
        if (!saved.success) {
            this.logger.warning('LocationRepository::eraseLocation - failed to persist locations', saved.error);
            return { success: false, error: 'Failed to erase location' };
        }

        return { success: true };
    }
}
