export type LatestRequestGuard = {
    next: () => number;
    claim: (request: number) => boolean;
};

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
