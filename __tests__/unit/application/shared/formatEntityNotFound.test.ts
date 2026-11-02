import { formatEntityNotFound } from '@application/shared/formatEntityNotFound';
import { SYSTEM_PROMPT_STORAGE_NAMESPACE, WORLD_MASTER_STORAGE_NAMESPACE } from '@domain/constants/general';

describe('formatEntityNotFound', () => {
    it('names the world master collection in a readable way', () => {
        expect(formatEntityNotFound('abc-123', WORLD_MASTER_STORAGE_NAMESPACE)).toBe('Entity not found for id: abc-123 from World Masters');
    });

    it('names the system prompt collection in a readable way', () => {
        expect(formatEntityNotFound('abc-123', SYSTEM_PROMPT_STORAGE_NAMESPACE)).toBe('Entity not found for id: abc-123 from System Prompts');
    });

    it('falls back to unknown collection when the key has no label', () => {
        expect(formatEntityNotFound('abc-123', 'not_a_collection')).toBe('Entity not found for id: abc-123 from unknown collection');
    });
});
