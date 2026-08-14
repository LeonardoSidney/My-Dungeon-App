import { Status } from '@domain/entities';

export function createStatusHelper (overrides?: Partial<Status>): Status {
    return {
        id: '1',
        name: 'Test Status',
        activationWord: 'activate',
        prompt: 'Status prompt',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
