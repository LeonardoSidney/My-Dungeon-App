import { PROFICIENCY_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Proficiency } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IProficiencyRepository, SaveProficiencyParams, EditProficiencyParams, EditProficiencyReturn, EraseProficiencyReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ProficiencyDTO } from '@infra/dto';

export class ProficiencyRepository implements IProficiencyRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findProficiencyIndex (proficiencies: Proficiency[], proficiencyId: string): Promise<number> {
        return proficiencies.findIndex((p) => p.id === proficiencyId);
    }

    private replaceAt (proficiencies: Proficiency[], index: number, newItem: Proficiency): Proficiency[] {
        proficiencies[index] = newItem;
        return proficiencies;
    }

    private removeAt (proficiencies: Proficiency[], index: number): Proficiency[] {
        proficiencies.splice(index, 1);
        return proficiencies;
    }

    async saveProficiency (params: SaveProficiencyParams): Promise<boolean> {
        this.logger.info('Executing ProficiencyRepository::saveProficiency');
        this.logger.debug('Executing ProficiencyRepository::saveProficiency - params: ', params);

        try {
            const { proficiency } = params;
            const existingData = await this.storage.load<Proficiency[]>(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`);
            const proficiencies: Proficiency[] = existingData ? [...existingData, proficiency] : [proficiency];
            await this.storage.save(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`, proficiencies);
        } catch (error) {
            this.logger.error('Error on ProficiencyRepository::saveProficiency', error);
            throw error;
        }
        return true;
    }

    async getProficiencyById (proficiencyId: string): Promise<Proficiency | undefined> {
        this.logger.info('Executing ProficiencyRepository::getProficiencyById');
        const proficiencies = await this.getProficiencies();
        return proficiencies.find((p) => p.id === proficiencyId);
    }

    async getProficiencies (): Promise<Proficiency[]> {
        this.logger.info('Executing ProficiencyRepository::getProficiencies');
        try {
            const proficiencies: Proficiency[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing ProficiencyRepository::getProficiencies - rawData: ', rawData);

            if (rawData) {
                const proficienciesDTO: ProficiencyDTO[] = [];
                for (const proficiencyUnknown of rawData) {
                    const proficiency = ProficiencyDTO.fromStorage(proficiencyUnknown);
                    if (proficiency) {
                        proficienciesDTO.push(proficiency);
                    }
                }

                proficiencies.push(...proficienciesDTO.map(dto => dto.toEntity()));

                if (rawData.length !== proficiencies.length) {
                    this.logger.warning('Some proficiencies were not converted to entity');
                }
            }

            this.logger.debug('Executing ProficiencyRepository::getProficiencies - proficiencies: ', proficiencies);

            return proficiencies;
        } catch (error) {
            this.logger.error('Error on ProficiencyRepository getProficiencies', error);
            throw error;
        }
    }

    async editProficiency (params: EditProficiencyParams): Promise<EditProficiencyReturn> {
        this.logger.info('Executing ProficiencyRepository::editProficiency');
        this.logger.debug('Executing ProficiencyRepository::editProficiency - params: ', params);

        try {
            const { proficiency } = params;
            const existingData = await this.storage.load<Proficiency[]>(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`);
            const proficiencies = existingData || [];
            const index = await this.findProficiencyIndex(proficiencies, proficiency.id);

            if (index === -1) {
                this.logger.warning(`Proficiency with id ${proficiency.id} not found`);
                return { success: false, error: `Proficiency with id ${proficiency.id} does not exist` };
            }

            const updatedProficiencies = this.replaceAt(proficiencies, index, proficiency);
            await this.storage.save(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`, updatedProficiencies);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on ProficiencyRepository::editProficiency', error);
            return { success: false, error: 'Failed to edit proficiency' };
        }
    }

    async eraseProficiency (proficiencyId: string): Promise<EraseProficiencyReturn> {
        this.logger.info('Executing ProficiencyRepository::eraseProficiency');
        this.logger.debug('Executing ProficiencyRepository::eraseProficiency - proficiencyId: ', proficiencyId);

        try {
            const existingData = await this.storage.load<Proficiency[]>(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`);
            const proficiencies = existingData || [];
            const index = await this.findProficiencyIndex(proficiencies, proficiencyId);

            if (index === -1) {
                this.logger.warning(`Proficiency with id ${proficiencyId} not found`);
                return { success: false, error: `Proficiency with id ${proficiencyId} does not exist` };
            }

            const filteredProficiencies = this.removeAt(proficiencies, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`, filteredProficiencies);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on ProficiencyRepository::eraseProficiency', error);
            return { success: false, error: 'Failed to erase proficiency' };
        }
    }
}
