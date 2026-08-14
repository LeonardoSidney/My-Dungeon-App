import { Proficiency } from '@domain/entities';

export function createProficiencyHelper (overrides?: Partial<Proficiency>): Proficiency {
    return {
        id: '1',
        name: 'Test Proficiency',
        activationWord: 'activate',
        prompt: 'Proficiency prompt',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
