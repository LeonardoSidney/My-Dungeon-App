import { ABILITY_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../domain/constants/general";
import { Ability } from "../../domain/entities/Ability";
import { ILogger } from "../../domain/logger";
import { IAbilityRepository, SaveAbilityParams } from "../../domain/repository";
import { IStorage } from "../../domain/storage";
import { AbilityDTO } from "../dto";

export class AbilityRepository implements IAbilityRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    public async saveAbility(params: SaveAbilityParams): Promise<boolean> {
        this.logger.info("Executing AbilityRepository::saveAbility");
        this.logger.debug("Executing AbilityRepository::saveAbility - params: ", params);

        try {
            const { ability } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`, ability);
        } catch (error) {
            this.logger.error("Error on AbilityRepository::saveAbility", error);
            throw error;
        }
        return true;
    }

    public async getAbilities(): Promise<Ability[]> {
        this.logger.info("Executing AbilityRepository::getAbilities");
        try {
            const abilities: Ability[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ABILITY_STORAGE_NAMESPACE}`);
            this.logger.debug("Executing AbilityRepository::getAbilities - rawData: ", rawData);

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
                    this.logger.warning("Some abilities were not converted to entity");
                }
            }

            this.logger.debug("Executing AbilityRepository::getAbilities - abilities: ", abilities);
            return abilities || [];
        } catch (error) {
            this.logger.error("Error on AbilityRepository::getAbilities", error);
            throw error;
        }
    }
}
