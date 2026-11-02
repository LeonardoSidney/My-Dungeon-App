import { ValidateUniqueIdsService } from '@application/services';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const WORLDS = REFERENCED_ENTITIES.WORLD.collection;
const ITEMS = REFERENCED_ENTITIES.ITEM.collection;

describe('ValidateUniqueIdsService', () => {
    const service = new ValidateUniqueIdsService(logger);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log the execution once', () => {
        service.validate({ idLists: [] });

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Executing ValidateUniqueIdsService::validate');
    });

    it('should log the repeated id', () => {
        service.validate({ idLists: [{ collection: WORLDS, ids: ['world-1', 'world-1'] }] });

        expect(logger.debug).toHaveBeenCalledWith('ValidateUniqueIdsService::validate - repeated id', 'Repeated id: world-1 from Worlds');
    });

    it('should accept no lists', () => {
        expect(service.validate({ idLists: [] })).toEqual({ success: true });
    });

    it('should accept an empty list', () => {
        expect(service.validate({ idLists: [{ collection: WORLDS, ids: [] }] })).toEqual({ success: true });
    });

    it('should accept a list without ids', () => {
        expect(service.validate({ idLists: [{ collection: WORLDS }] })).toEqual({ success: true });
    });

    it('should accept a list of different ids', () => {
        expect(service.validate({ idLists: [{ collection: WORLDS, ids: ['world-1', 'world-2'] }] })).toEqual({ success: true });
    });

    it('should accept the same id in two different lists', () => {
        const response = service.validate({
            idLists: [
                { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: ['npc'] },
                { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: ['npc'] },
            ],
        });

        expect(response).toEqual({ success: true });
    });

    it('should reject a repeated character id', () => {
        const response = service.validate({ idLists: [{ collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: ['hero', 'hero'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: hero from Characters' });
    });

    it('should reject a repeated system prompt id', () => {
        const response = service.validate({ idLists: [{ collection: REFERENCED_ENTITIES.SYSTEM_PROMPT.collection, ids: ['prompt-1', 'prompt-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: prompt-1 from System Prompts' });
    });

    it('should reject a repeated world id', () => {
        const response = service.validate({ idLists: [{ collection: WORLDS, ids: ['world-1', 'world-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: world-1 from Worlds' });
    });

    it('should reject a repeated location id', () => {
        const response = service.validate({ idLists: [{ collection: REFERENCED_ENTITIES.LOCATION.collection, ids: ['location-1', 'location-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: location-1 from Locations' });
    });

    it('should reject a repeated item id', () => {
        const response = service.validate({ idLists: [{ collection: ITEMS, ids: ['item-1', 'item-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: item-1 from Items' });
    });

    it('should reject a repeated ability id', () => {
        const response = service.validate({ idLists: [{ collection: REFERENCED_ENTITIES.ABILITY.collection, ids: ['ability-1', 'ability-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: ability-1 from Abilities' });
    });

    it('should reject a repeated proficiency id', () => {
        const response = service.validate({ idLists: [{ collection: REFERENCED_ENTITIES.PROFICIENCY.collection, ids: ['proficiency-1', 'proficiency-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: proficiency-1 from Proficiencies' });
    });

    it('should reject a repeated status id', () => {
        const response = service.validate({ idLists: [{ collection: REFERENCED_ENTITIES.STATUS.collection, ids: ['status-1', 'status-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: status-1 from Statuses' });
    });

    it('should reject a repeated blank id', () => {
        const response = service.validate({ idLists: [{ collection: WORLDS, ids: ['', ''] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id:  from Worlds' });
    });

    it('should reject a repetition that is not adjacent', () => {
        const response = service.validate({ idLists: [{ collection: WORLDS, ids: ['world-1', 'world-2', 'world-1'] }] });

        expect(response).toEqual({ success: false, error: 'Repeated id: world-1 from Worlds' });
    });

    it('should find a repetition in a list after a valid one', () => {
        const response = service.validate({
            idLists: [
                { collection: WORLDS, ids: ['world-1'] },
                { collection: ITEMS, ids: ['item-1', 'item-1'] },
            ],
        });

        expect(response).toEqual({ success: false, error: 'Repeated id: item-1 from Items' });
    });

    it('should report the first list with a repetition', () => {
        const response = service.validate({
            idLists: [
                { collection: WORLDS, ids: ['world-1', 'world-1'] },
                { collection: ITEMS, ids: ['item-1', 'item-1'] },
            ],
        });

        expect(response).toEqual({ success: false, error: 'Repeated id: world-1 from Worlds' });
    });

    it('should name an unknown collection as such', () => {
        const response = service.validate({ idLists: [{ collection: 'not-a-collection', ids: ['id-1', 'id-1'] }] });

        expect(response.success).toBe(false);
        expect(response.error).toMatch(/^Repeated id: id-1 from /);
        expect(response.error).not.toContain('not-a-collection');
    });
});
