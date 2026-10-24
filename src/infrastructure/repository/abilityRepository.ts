import { ABILITY_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Ability } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    SaveAbilityParams,
    SaveAbilityRepositoryReturn,
    GetAbilitiesRepositoryReturn,
    GetAbilityByIdRepositoryReturn,
    EditAbilityParams,
    EditAbilityReturn,
    EraseAbilityReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { AbilityDTO } from '@infra/dto';

export class AbilityRepository implements IAbilityRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`;
    }

    async saveAbility (params: SaveAbilityParams): Promise<SaveAbilityRepositoryReturn> {
        this.logger.info('Executing AbilityRepository::saveAbility');
        this.logger.debug('Executing AbilityRepository::saveAbility - params: ', params);

        const loaded = await this.storage.load<Ability[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AbilityRepository::saveAbility - failed to load abilities', loaded.error);
            return { success: false, error: 'Failed to save ability' };
        }

        const abilities = [...(loaded.data ?? []), params.ability];
        const saved = await this.storage.save(this.storageKey, abilities);
        if (!saved.success) {
            this.logger.warning('AbilityRepository::saveAbility - failed to persist abilities', saved.error);
            return { success: false, error: 'Failed to save ability' };
        }

        return { success: true };
    }

    async getAbilityById (abilityId: string): Promise<GetAbilityByIdRepositoryReturn> {
        this.logger.info('Executing AbilityRepository::getAbilityById');

        const response = await this.getAbilities();
        if (!response.success || !response.abilities) {
            return { success: false, error: response.error };
        }

        return { success: true, ability: response.abilities.find((a) => a.id === abilityId) };
    }

    async getAbilities (): Promise<GetAbilitiesRepositoryReturn> {
        this.logger.info('Executing AbilityRepository::getAbilities');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AbilityRepository::getAbilities - failed to load abilities', loaded.error);
            return { success: false, error: 'Failed to load abilities' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing AbilityRepository::getAbilities - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('AbilityRepository::getAbilities - stored abilities are not a list');
            return { success: false, error: 'Failed to load abilities' };
        }

        const abilities: Ability[] = [];
        for (const abilityUnknown of rawData) {
            const dto = AbilityDTO.fromStorage(abilityUnknown);
            if (dto) {
                abilities.push(dto.toEntity());
            }
        }

        if (rawData.length !== abilities.length) {
            this.logger.warning('Some abilities were not converted to entity');
        }

        this.logger.debug('Executing AbilityRepository::getAbilities - abilities: ', abilities);
        return { success: true, abilities };
    }

    async editAbility (params: EditAbilityParams): Promise<EditAbilityReturn> {
        this.logger.info('Executing AbilityRepository::editAbility');
        this.logger.debug('Executing AbilityRepository::editAbility - params: ', params);

        const { ability } = params;
        const loaded = await this.storage.load<Ability[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AbilityRepository::editAbility - failed to load abilities', loaded.error);
            return { success: false, error: 'Failed to edit ability' };
        }

        const abilities = loaded.data ?? [];
        const index = abilities.findIndex((a) => a.id === ability.id);
        if (index === -1) {
            this.logger.warning(`Ability with id ${ability.id} not found`);
            return { success: false, error: `Ability with id ${ability.id} does not exist` };
        }

        abilities[index] = ability;
        const saved = await this.storage.save(this.storageKey, abilities);
        if (!saved.success) {
            this.logger.warning('AbilityRepository::editAbility - failed to persist abilities', saved.error);
            return { success: false, error: 'Failed to edit ability' };
        }

        return { success: true };
    }

    async eraseAbility (abilityId: string): Promise<EraseAbilityReturn> {
        this.logger.info('Executing AbilityRepository::eraseAbility');
        this.logger.debug('Executing AbilityRepository::eraseAbility - abilityId: ', abilityId);

        const loaded = await this.storage.load<Ability[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('AbilityRepository::eraseAbility - failed to load abilities', loaded.error);
            return { success: false, error: 'Failed to erase ability' };
        }

        const abilities = loaded.data ?? [];
        const index = abilities.findIndex((a) => a.id === abilityId);
        if (index === -1) {
            this.logger.warning(`Ability with id ${abilityId} not found`);
            return { success: false, error: `Ability with id ${abilityId} does not exist` };
        }

        abilities.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, abilities);
        if (!saved.success) {
            this.logger.warning('AbilityRepository::eraseAbility - failed to persist abilities', saved.error);
            return { success: false, error: 'Failed to erase ability' };
        }

        return { success: true };
    }
}
