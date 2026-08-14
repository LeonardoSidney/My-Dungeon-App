import { Attribute } from '@domain/entities';

export function createAttributeHelper (overrides?: Partial<Attribute>): Attribute {
    return {
        name: 'Test Attribute',
        value: 10,
        ...overrides
    };
}
