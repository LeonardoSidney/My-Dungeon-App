import { COLLECTION_LABELS } from '@domain/constants/general';
import { formatEntityNotFound } from './formatEntityNotFound';

export type ReferencedIdCheckResult = string | null;

type ReferencedIdLookup = { success: boolean; error?: string; };

export async function checkReferencedId<TResponse extends ReferencedIdLookup> (
    resolve: (id: string) => Promise<TResponse>,
    entity: { key: NoInfer<Exclude<keyof TResponse, keyof ReferencedIdLookup>>; collection: string; },
    id: string | undefined
): Promise<ReferencedIdCheckResult> {
    if (!id) {
        return null;
    }

    const response = await resolve(id);
    if (!response.success) {
        return response.error ?? `Failed to load ${COLLECTION_LABELS[entity.collection]}: ${id}`;
    }

    if (!response[entity.key]) {
        return formatEntityNotFound(id, entity.collection);
    }

    return null;
}

export async function checkReferencedIds<TResponse extends ReferencedIdLookup> (
    resolve: (id: string) => Promise<TResponse>,
    entity: { key: NoInfer<Exclude<keyof TResponse, keyof ReferencedIdLookup>>; collection: string; },
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
