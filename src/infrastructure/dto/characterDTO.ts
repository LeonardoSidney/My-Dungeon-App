import { Ability, Assistant, Attribute, Character, Proficiency, Status } from '@domain/entities';
import { AbilityDTO } from './abilityDTO';
import { AssistantDTO } from './assistantDTO';
import { ProficiencyDTO } from './proficiencyDTO';
import { isArrayRecord, isRecord, parseDate } from './shared';
import { StatusDTO } from './statusDTO';

export class CharacterDTO {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly activationWord: string,
        private readonly prompt: string,
        private readonly observation: string | undefined,
        private readonly abilities: Ability[] | undefined,
        private readonly proficiencies: Proficiency[] | undefined,
        private readonly status: Status[] | undefined,
        private readonly attributes: Attribute[] | undefined,
        private readonly assistant: Assistant,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity(): Character {
        return {
            id: this.id,
            name: this.name,
            activationWord: this.activationWord,
            prompt: this.prompt,
            observation: this.observation,
            abilities: this.abilities,
            proficiencies: this.proficiencies,
            statuses: this.status,
            attributes: this.attributes,
            assistant: this.assistant,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage(data: unknown): CharacterDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        const abilities = this.toAbilities(data.abilities);
        const proficiencies = this.toProficiencies(data.proficiencies);
        const status = this.toStatus(data.status);
        const attributes = this.toAttributes(data.attributes);
        const assistant = this.toAssistant(data.assistant);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.activationWord !== 'string' ||
            typeof data.prompt !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            assistant === undefined ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new CharacterDTO(
            data.id,
            data.name,
            data.activationWord,
            data.prompt,
            data.observation,
            abilities,
            proficiencies,
            status,
            attributes,
            assistant,
            createdAt,
            updatedAt
        );
    }

    private static toAssistant(assistant: unknown | undefined): Assistant | undefined {
        if (!isRecord(assistant)) {
            return undefined;
        }

        const assistantDTO = AssistantDTO.fromStorage(assistant);
        return assistantDTO?.toEntity();
    }

    private static toAbilities(abilities: unknown | undefined): Ability[] | undefined {
        if (!isArrayRecord(abilities)) {
            return undefined;
        }

        const abilitiesDTO = abilities.map(ability => AbilityDTO.fromStorage(ability));
        const validAbilities: Ability[] = [];
        for (const abilityDTO of abilitiesDTO) {
            if (abilityDTO !== null) {
                validAbilities.push(abilityDTO.toEntity());
            }
        }

        return validAbilities;
    }

    private static toProficiencies(proficiencies: unknown | undefined): Proficiency[] | undefined {
        if (!isArrayRecord(proficiencies)) {
            return undefined;
        }

        const proficienciesDTO = proficiencies.map(proficiency => ProficiencyDTO.fromStorage(proficiency));
        const validProficiencies: Proficiency[] = [];
        for (const proficiencyDTO of proficienciesDTO) {
            if (proficiencyDTO !== null) {
                validProficiencies.push(proficiencyDTO.toEntity());
            }
        }

        return validProficiencies;
    }

    private static toStatus(statuses: unknown | undefined): Status[] | undefined {
        if (!isArrayRecord(statuses)) {
            return undefined;
        }

        const statusesDTO = statuses.map(status => StatusDTO.fromStorage(status));
        const validStatus: Status[] = [];
        for (const element of statusesDTO) {
            if (element !== null) {
                validStatus.push(element.toEntity());
            }
        }

        return validStatus;
    }

    private static toAttributes(attributes: unknown | undefined): Attribute[] | undefined {
        if (!isArrayRecord(attributes)) {
            return undefined;
        }

        const validAttributes: Attribute[] = [];
        for (const attribute of attributes) {
            if (typeof attribute.name === 'string' && typeof attribute.value === 'number') {
                validAttributes.push({ name: attribute.name, value: attribute.value });
            }
        }

        return validAttributes;
    }
}
