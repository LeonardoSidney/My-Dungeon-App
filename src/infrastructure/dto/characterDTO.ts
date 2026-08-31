import { Attribute, Character } from '@domain/entities';
import { isArrayRecord, isRecord, isStringArray, parseDate } from './shared';

export class CharacterDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly activationWord: string,
        private readonly prompt: string,
        private readonly observation: string | undefined,
        private readonly abilityIds: string[] | undefined,
        private readonly proficiencyIds: string[] | undefined,
        private readonly statusIds: string[] | undefined,
        private readonly attributes: Attribute[] | undefined,
        private readonly assistantId: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): Character {
        return {
            id: this.id,
            name: this.name,
            activationWord: this.activationWord,
            prompt: this.prompt,
            observation: this.observation,
            abilityIds: this.abilityIds,
            proficiencyIds: this.proficiencyIds,
            statusIds: this.statusIds,
            attributes: this.attributes,
            assistantId: this.assistantId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): CharacterDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        const abilityIds = this.toStringArray(data.abilityIds);
        const proficiencyIds = this.toStringArray(data.proficiencyIds);
        const statusIds = this.toStringArray(data.statusIds);
        const attributes = this.toAttributes(data.attributes);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.activationWord !== 'string' ||
            typeof data.prompt !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            typeof data.assistantId !== 'string' ||
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
            abilityIds,
            proficiencyIds,
            statusIds,
            attributes,
            data.assistantId,
            createdAt,
            updatedAt
        );
    }

    private static toStringArray (ids: unknown | undefined): string[] | undefined {
        if (ids === undefined) {
            return undefined;
        }

        if (!isStringArray(ids)) {
            return undefined;
        }

        return ids;
    }

    private static toAttributes (attributes: unknown | undefined): Attribute[] | undefined {
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
