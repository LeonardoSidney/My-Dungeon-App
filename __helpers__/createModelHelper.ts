import { Model } from '@domain/entities';
import { createConnectionHelper } from './createConnectionHelper';

export function createModelHelper (overrides?: Partial<Model>): Model {
    return {
        id: '1',
        name: 'Test Model',
        connection: createConnectionHelper(),
        nCtx: 4096,
        ownedBy: 'test',
        ...overrides
    };
}
