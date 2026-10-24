import { PROFICIENCY_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Proficiency } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IProficiencyRepository,
    SaveProficiencyParams,
    SaveProficiencyRepositoryReturn,
    GetProficienciesRepositoryReturn,
    GetProficiencyByIdRepositoryReturn,
    EditProficiencyParams,
    EditProficiencyReturn,
    EraseProficiencyReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ProficiencyDTO } from '@infra/dto';

export class ProficiencyRepository implements IProficiencyRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`;
    }

    async saveProficiency (params: SaveProficiencyParams): Promise<SaveProficiencyRepositoryReturn> {
        this.logger.info('Executing ProficiencyRepository::saveProficiency');
        this.logger.debug('Executing ProficiencyRepository::saveProficiency - params: ', params);

        const loaded = await this.storage.load<Proficiency[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ProficiencyRepository::saveProficiency - failed to load proficiencies', loaded.error);
            return { success: false, error: 'Failed to save proficiency' };
        }

        const proficiencies = [...(loaded.data ?? []), params.proficiency];
        const saved = await this.storage.save(this.storageKey, proficiencies);
        if (!saved.success) {
            this.logger.warning('ProficiencyRepository::saveProficiency - failed to persist proficiencies', saved.error);
            return { success: false, error: 'Failed to save proficiency' };
        }

        return { success: true };
    }

    async getProficiencyById (proficiencyId: string): Promise<GetProficiencyByIdRepositoryReturn> {
        this.logger.info('Executing ProficiencyRepository::getProficiencyById');

        const response = await this.getProficiencies();
        if (!response.success || !response.proficiencies) {
            return { success: false, error: response.error };
        }

        return { success: true, proficiency: response.proficiencies.find((p) => p.id === proficiencyId) };
    }

    async getProficiencies (): Promise<GetProficienciesRepositoryReturn> {
        this.logger.info('Executing ProficiencyRepository::getProficiencies');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ProficiencyRepository::getProficiencies - failed to load proficiencies', loaded.error);
            return { success: false, error: 'Failed to load proficiencies' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing ProficiencyRepository::getProficiencies - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('ProficiencyRepository::getProficiencies - stored proficiencies are not a list');
            return { success: false, error: 'Failed to load proficiencies' };
        }

        const proficiencies: Proficiency[] = [];
        for (const proficiencyUnknown of rawData) {
            const dto = ProficiencyDTO.fromStorage(proficiencyUnknown);
            if (dto) {
                proficiencies.push(dto.toEntity());
            }
        }

        if (rawData.length !== proficiencies.length) {
            this.logger.warning('Some proficiencies were not converted to entity');
        }

        this.logger.debug('Executing ProficiencyRepository::getProficiencies - proficiencies: ', proficiencies);
        return { success: true, proficiencies };
    }

    async editProficiency (params: EditProficiencyParams): Promise<EditProficiencyReturn> {
        this.logger.info('Executing ProficiencyRepository::editProficiency');
        this.logger.debug('Executing ProficiencyRepository::editProficiency - params: ', params);

        const { proficiency } = params;
        const loaded = await this.storage.load<Proficiency[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ProficiencyRepository::editProficiency - failed to load proficiencies', loaded.error);
            return { success: false, error: 'Failed to edit proficiency' };
        }

        const proficiencies = loaded.data ?? [];
        const index = proficiencies.findIndex((p) => p.id === proficiency.id);
        if (index === -1) {
            this.logger.warning(`Proficiency with id ${proficiency.id} not found`);
            return { success: false, error: `Proficiency with id ${proficiency.id} does not exist` };
        }

        proficiencies[index] = proficiency;
        const saved = await this.storage.save(this.storageKey, proficiencies);
        if (!saved.success) {
            this.logger.warning('ProficiencyRepository::editProficiency - failed to persist proficiencies', saved.error);
            return { success: false, error: 'Failed to edit proficiency' };
        }

        return { success: true };
    }

    async eraseProficiency (proficiencyId: string): Promise<EraseProficiencyReturn> {
        this.logger.info('Executing ProficiencyRepository::eraseProficiency');
        this.logger.debug('Executing ProficiencyRepository::eraseProficiency - proficiencyId: ', proficiencyId);

        const loaded = await this.storage.load<Proficiency[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ProficiencyRepository::eraseProficiency - failed to load proficiencies', loaded.error);
            return { success: false, error: 'Failed to erase proficiency' };
        }

        const proficiencies = loaded.data ?? [];
        const index = proficiencies.findIndex((p) => p.id === proficiencyId);
        if (index === -1) {
            this.logger.warning(`Proficiency with id ${proficiencyId} not found`);
            return { success: false, error: `Proficiency with id ${proficiencyId} does not exist` };
        }

        proficiencies.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, proficiencies);
        if (!saved.success) {
            this.logger.warning('ProficiencyRepository::eraseProficiency - failed to persist proficiencies', saved.error);
            return { success: false, error: 'Failed to erase proficiency' };
        }

        return { success: true };
    }
}
