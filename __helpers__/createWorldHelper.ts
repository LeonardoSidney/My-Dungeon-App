import { World } from '@domain/entities';

export function createWorldHelper (overrides?: Partial<World>): World {
    return {
        id: '1',
        name: 'Test World',
        activationWord: 'activate',
        prompt: 'World prompt',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
