import { WorldMaster } from '@domain/entities';
import { createAssistantHelper } from './createAssistantHelper';

export function createWorldMasterHelper (overrides?: Partial<WorldMaster>): WorldMaster {
    return {
        id: '1',
        name: 'Test WorldMaster',
        activationWord: 'activate',
        prompt: 'Master prompt',
        observation: 'Test observation',
        assistant: createAssistantHelper(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
