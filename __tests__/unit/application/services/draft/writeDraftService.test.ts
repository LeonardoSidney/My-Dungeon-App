import { WriteDraftService } from '@application/services';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('WriteDraftService', () => {
    it('creates a new draft with matching creation and update dates', () => {
        const draft = new WriteDraftService(logger).write({ draftId: 'home', content: 'Hello' });

        expect(draft).toEqual({ id: 'home', content: 'Hello', createdAt: expect.any(Date), updatedAt: expect.any(Date) });
        expect(draft.createdAt).toEqual(draft.updatedAt);
    });

    it('keeps the creation date of an existing draft', () => {
        const createdAt = new Date('2026-01-01T00:00:00.000Z');
        const existing = { id: 'home', content: 'old', createdAt, updatedAt: createdAt };

        const draft = new WriteDraftService(logger).write({ draftId: 'home', content: 'new', existing });

        expect(draft.content).toBe('new');
        expect(draft.createdAt).toBe(createdAt);
        expect(draft.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime());
    });
});
