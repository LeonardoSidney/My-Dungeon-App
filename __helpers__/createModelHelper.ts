import { Model } from '@domain/entities';

export function createModelHelper (overrides?: Partial<Model>): Model {
    return {
        id: '1',
        name: 'Test Model',
        connectionId: '1',
        nCtx: 4096,
        ownedBy: 'test',
        ...overrides
    };
}
