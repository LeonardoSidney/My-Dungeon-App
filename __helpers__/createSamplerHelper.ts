import { Sampler } from '@domain/entities';

export function createSamplerHelper(overrides?: Partial<Sampler>): Sampler {
  return {
    id: '1',
    name: 'Test Sampler',
    observation: 'Test observation',
    systemDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}
