import { WorldMaster } from '@domain/entities';

export function createWorldMasterHelper (overrides?: Partial<WorldMaster>): WorldMaster {
    return {
        id: '1',
        name: 'Test WorldMaster',
        activationWord: 'activate',
        prompt: 'Master prompt',
        observation: 'Test observation',
        assistantId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
