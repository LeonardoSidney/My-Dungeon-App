import { SystemPrompt } from '@domain/entities';

export function createSystemPromptHelper(overrides?: Partial<SystemPrompt>): SystemPrompt {
  return {
    id: '1',
    name: 'Test SystemPrompt',
    content: 'System prompt content',
    observation: 'Test observation',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}
