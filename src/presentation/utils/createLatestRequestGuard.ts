export type LatestRequestGuard = {
    next: () => number;
    claim: (request: number) => boolean;
};

/**
 * Discards responses that arrive out of order: only a request newer than the
 * last applied one can claim the right to update the state.
 */
export function createLatestRequestGuard (): LatestRequestGuard {
    let requested = 0;
    let applied = 0;

    return {
        next: () => {
            requested += 1;
            return requested;
        },
        claim: (request: number) => {
            if (request <= applied) {
                return false;
            }

            applied = request;
            return true;
        },
    };
}
