export type ReferencedIdCheckResult = string | null;

export async function checkReferencedId<
    TEntity,
    TResolve extends (id: string) => Promise<TEntity | undefined>
> (
    resolve: TResolve,
    id: string | undefined,
    entityLabel: string
): Promise<ReferencedIdCheckResult> {
    if (!id) {
        return null;
    }
    const entity = await resolve(id);
    if (!entity) {
        return `${entityLabel} not found: ${id}`;
    }
    return null;
}

export async function checkReferencedIds<
    TEntity,
    TResolve extends (id: string) => Promise<TEntity | undefined>
> (
    resolve: TResolve,
    ids: string[],
    entityLabel: string
): Promise<ReferencedIdCheckResult> {
    for (const id of ids) {
        const error = await checkReferencedId(resolve, id, entityLabel);
        if (error) {
            return error;
        }
    }
    return null;
}
