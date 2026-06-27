import { PROFICIENCY_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../domain/constants/general";
import { Proficiency } from "../../domain/entities/Proficiency";
import { ILogger } from "../../domain/logger";
import { IProficiencyRepository, SaveProficiencyParams } from "../../domain/repository";
import { IStorage } from "../../domain/storage";
import { ProficiencyDTO } from "../dto";

export class ProficiencyRepository implements IProficiencyRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    public async saveProficiency(params: SaveProficiencyParams): Promise<boolean> {
        this.logger.info("Executing ProficiencyRepository::saveProficiency");
        this.logger.debug("Executing ProficiencyRepository::saveProficiency - params: ", params);

        try {
            const { proficiency } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`, proficiency);
        } catch (error) {
            this.logger.error("Error on ProficiencyRepository::saveProficiency", error);
            throw error;
        }
        return true;
    }

    public async getProficiencies(): Promise<Proficiency[]> {
        this.logger.info("Executing ProficiencyRepository::getProficiencies");
        try {
            const proficiencies: Proficiency[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${PROFICIENCY_STORAGE_NAMESPACE}`);
            this.logger.debug("Executing ProficiencyRepository::getProficiencies - rawData: ", rawData);

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
                    this.logger.warning("Some proficiencies were not converted to entity");
                }
            }

            this.logger.debug("Executing ProficiencyRepository::getProficiencies - proficiencies: ", proficiencies);

            return proficiencies;
        } catch (error) {
            this.logger.error("Error on ProficiencyRepository getProficiencies", error);
            throw error;
        }
    }
}
