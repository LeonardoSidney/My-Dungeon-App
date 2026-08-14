import { Assistant } from '@domain/entities';
import { createModelHelper } from './createModelHelper';
import { createSamplerHelper } from './createSamplerHelper';

export function createAssistantHelper (overrides?: Partial<Assistant>): Assistant {
    return {
        id: '1',
        name: 'Test Assistant',
        observation: 'Test observation',
        model: createModelHelper(),
        sampler: createSamplerHelper(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
