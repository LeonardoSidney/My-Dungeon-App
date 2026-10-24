export type ReferencedIdCheckResult = string | null;

type ReferencedIdLookup = { success: boolean; error?: string; };

export async function checkReferencedId<TResponse extends ReferencedIdLookup> (
    resolve: (id: string) => Promise<TResponse>,
    entity: { key: NoInfer<Exclude<keyof TResponse, keyof ReferencedIdLookup>>; label: string; },
    id: string | undefined
): Promise<ReferencedIdCheckResult> {
    if (!id) {
        return null;
    }

    const response = await resolve(id);
    if (!response.success) {
        return response.error ?? `Failed to load ${entity.label}: ${id}`;
    }

    if (!response[entity.key]) {
        return `${entity.label} not found: ${id}`;
    }

    return null;
}

export async function checkReferencedIds<TResponse extends ReferencedIdLookup> (
    resolve: (id: string) => Promise<TResponse>,
    entity: { key: NoInfer<Exclude<keyof TResponse, keyof ReferencedIdLookup>>; label: string; },
    ids: string[]
): Promise<ReferencedIdCheckResult> {
    for (const id of ids) {
        const error = await checkReferencedId(resolve, entity, id);
        if (error) {
            return error;
        }
    }
    return null;
}
