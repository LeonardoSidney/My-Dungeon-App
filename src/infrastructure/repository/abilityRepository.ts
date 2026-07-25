import { ABILITY_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Ability } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAbilityRepository, SaveAbilityParams, EditAbilityParams, EditAbilityReturn, EraseAbilityReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AbilityDTO } from '../dto';

export class AbilityRepository implements IAbilityRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveAbility (params: SaveAbilityParams): Promise<boolean> {
        this.logger.info('Executing AbilityRepository::saveAbility');
        this.logger.debug('Executing AbilityRepository::saveAbility - params: ', params);

        try {
            const { ability } = params;
            const existingData = await this.storage.load<Ability[]>(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`);
            const abilities: Ability[] = existingData ? [...existingData, ability] : [ability];
            await this.storage.save(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`, abilities);
        } catch (error) {
            this.logger.error('Error on AbilityRepository::saveAbility', error);
            throw error;
        }
        return true;
    }

    async getAbilities (): Promise<Ability[]> {
        this.logger.info('Executing AbilityRepository::getAbilities');
        try {
            const abilities: Ability[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing AbilityRepository::getAbilities - rawData: ', rawData);

            if (rawData) {
                const abilitiesDTO: AbilityDTO[] = [];
                for (const abilityUnknown of rawData) {
                    const ability = AbilityDTO.fromStorage(abilityUnknown);
                    if (ability) {
                        abilitiesDTO.push(ability);
                    }
                }

                abilities.push(...abilitiesDTO.map(dto => dto.toEntity()));

                if (rawData.length !== abilities.length) {
                    this.logger.warning('Some abilities were not converted to entity');
                }
            }

            this.logger.debug('Executing AbilityRepository::getAbilities - abilities: ', abilities);
            return abilities || [];
        } catch (error) {
            this.logger.error('Error on AbilityRepository::getAbilities', error);
            throw error;
        }
    }

    async editAbility (params: EditAbilityParams): Promise<EditAbilityReturn> {
        this.logger.info('Executing AbilityRepository::editAbility');
        this.logger.debug('Executing AbilityRepository::editAbility - params: ', params);

        try {
            const { ability } = params;
            const existingData = await this.storage.load<Ability[]>(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`);
            const abilities = existingData || [];
            const index = abilities.findIndex((a) => a.id === ability.id);

            if (index === -1) {
                this.logger.warning(`Ability with id ${ability.id} not found`);
                return { success: false, error: `Ability with id ${ability.id} does not exist` };
            }

            abilities[index] = ability;
            await this.storage.save(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`, abilities);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on AbilityRepository::editAbility', error);
            return { success: false, error: 'Failed to edit ability' };
        }
    }

    async eraseAbility (abilityId: string): Promise<EraseAbilityReturn> {
        this.logger.info('Executing AbilityRepository::eraseAbility');
        this.logger.debug('Executing AbilityRepository::eraseAbility - abilityId: ', abilityId);

        try {
            const existingData = await this.storage.load<Ability[]>(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`);
            const abilities = existingData || [];
            const index = abilities.findIndex((a) => a.id === abilityId);

            if (index === -1) {
                this.logger.warning(`Ability with id ${abilityId} not found`);
                return { success: false, error: `Ability with id ${abilityId} does not exist` };
            }

            abilities.splice(index, 1);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`, abilities);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on AbilityRepository::eraseAbility', error);
            return { success: false, error: 'Failed to erase ability' };
        }
    }
}
