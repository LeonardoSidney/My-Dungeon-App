import { COLLECTION_LABELS, UNKNOWN_COLLECTION } from '@domain/constants/general';

export function formatEntityNotFound (id: string, collection: string): string {
    const collectionLabel = COLLECTION_LABELS[collection] ?? UNKNOWN_COLLECTION;
    return `Entity not found for id: ${id} from ${collectionLabel}`;
}
