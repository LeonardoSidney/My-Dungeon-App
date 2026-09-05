export const MODEL_ID_PLACEHOLDER = 'local-model';

type NamedEntity = { id: string; name: string; };

export function nameIndex<T extends NamedEntity> (entities: T[]): Map<string, T> {
    return new Map(entities.map(entity => [entity.name, entity]));
}

export function resolveReferencedIds<T extends NamedEntity> (
    index: Map<string, T>,
    names: string[],
    label: string,
    ownerLabel: string
): string[] {
    const ids: string[] = [];
    for (const name of names) {
        const entity = index.get(name);
        if (!entity) {
            throw new Error(`Migration: ${label} "${name}" for ${ownerLabel} does not exist`);
        }
        ids.push(entity.id);
    }
    return ids;
}
