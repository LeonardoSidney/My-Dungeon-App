export const MODEL_ID_PLACEHOLDER = 'local-model';

export type NamedEntity = { id: string; name: string; };

export type MigrationReturn = {
    success: boolean;
    error?: string;
};

export type ListItemsReturn<T> = {
    success: boolean;
    items?: T[];
    error?: string;
};

export type ResolveReferencedIdsReturn = {
    success: boolean;
    ids?: string[];
    error?: string;
};

export function listItems<T> (response: { success: boolean; items?: T[]; error?: string; }, label: string): ListItemsReturn<T> {
    if (!response.success || !response.items) {
        return { success: false, error: `Migration: failed to load ${label}: ${response.error}` };
    }
    return { success: true, items: response.items };
}

export function nameIndex<T extends NamedEntity> (entities: T[]): Map<string, T> {
    return new Map(entities.map(entity => [entity.name, entity]));
}

export function resolveReferencedIds<T extends NamedEntity> (
    index: Map<string, T>,
    names: string[],
    label: string,
    ownerLabel: string
): ResolveReferencedIdsReturn {
    const ids: string[] = [];
    for (const name of names) {
        const entity = index.get(name);
        if (!entity) {
            return { success: false, error: `Migration: ${label} "${name}" for ${ownerLabel} does not exist` };
        }
        ids.push(entity.id);
    }
    return { success: true, ids };
}
