import { Assistant } from '@domain/entities';

export function createAssistantHelper (overrides?: Partial<Assistant>): Assistant {
    return {
        id: '1',
        name: 'Test Assistant',
        observation: 'Test observation',
        modelId: '1',
        samplerId: '1',
        connectionId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
