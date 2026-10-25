export type LatestRequestGuard = {
    next: () => number;
    claim: (request: number) => boolean;
};
