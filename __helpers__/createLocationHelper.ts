import { Location } from '@domain/entities';

export function createLocationHelper(overrides?: Partial<Location>): Location {
    return {
        id: '1',
        name: 'Test Location',
        activationWord: 'activate',
        prompt: 'Location prompt',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
