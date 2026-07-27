import { Ability } from '@domain/entities';

export function createAbilityHelper(overrides?: Partial<Ability>): Ability {
    return {
        id: '1',
        name: 'Test Ability',
        activationWorld: 'activation world',
        prompt: 'Ability prompt',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
