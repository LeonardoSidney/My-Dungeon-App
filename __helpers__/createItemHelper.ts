import { Item } from '@domain/entities';

export function createItemHelper (overrides?: Partial<Item>): Item {
    return {
        id: '1',
        name: 'Test Item',
        activationWord: 'activate',
        prompt: 'Item prompt',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
