import { ValidateAdventureCharacterSelectionService } from '@application/services';
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

describe('ValidateAdventureCharacterSelectionService', () => {
    const service = new ValidateAdventureCharacterSelectionService(logger);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log the execution once', () => {
        service.validate({ characterIds: ['playable'], worldMasterId: 'wm-entity', charactersControlledByAi: [] });

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Executing ValidateAdventureCharacterSelectionService::validate');
    });

    it('should log the reason of an invalid selection', () => {
        service.validate({ characterIds: [], worldMasterId: 'wm-entity', charactersControlledByAi: [] });

        expect(logger.debug).toHaveBeenCalledWith(
            'ValidateAdventureCharacterSelectionService::validate - invalid selection',
            'You need at least 1 playable character'
        );
    });

    it('should reject both a dedicated world master and a character acting as world master', () => {
        const response = service.validate({
            characterIds: ['playable', 'wmChar'],
            worldMasterId: 'wm-entity',
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: false, error: 'An adventure cannot have both a world master and a character acting as world master' });
    });

    it('should reject a character acting as world master that is not part of the adventure', () => {
        const response = service.validate({
            characterIds: ['playable'],
            characterAsWorldMasterId: 'missing',
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: false, error: 'The character acting as world master must be part of the adventure' });
    });

    it('should reject an AI controlled character that is not part of the adventure', () => {
        const response = service.validate({
            characterIds: ['playable', 'wmChar'],
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: ['missing'],
        });

        expect(response).toEqual({ success: false, error: 'Every AI controlled character must be part of the adventure' });
    });

    it('should reject a character acting as world master that is also AI controlled', () => {
        const response = service.validate({
            characterIds: ['playable', 'wmChar'],
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: ['wmChar'],
        });

        expect(response).toEqual({ success: false, error: 'The character acting as world master cannot be AI controlled' });
    });

    it('should require at least one playable character', () => {
        const response = service.validate({
            characterIds: ['wmChar'],
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
    });

    it('should reject a cast where the only character is AI controlled', () => {
        const response = service.validate({
            characterIds: ['npc'],
            worldMasterId: 'wm-entity',
            charactersControlledByAi: ['npc'],
        });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
    });

    it('should not count the character acting as world master as playable when worldMasterId is blank', () => {
        const response = service.validate({
            characterIds: ['wmChar'],
            worldMasterId: '',
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
    });

    it('should reject an adventure without a world master that has no character acting as world master', () => {
        const response = service.validate({
            characterIds: ['playable', 'playable2'],
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: false, error: 'An adventure without a world master needs a character acting as world master' });
    });

    it('should accept a character acting as world master with one playable character', () => {
        const response = service.validate({
            characterIds: ['wmChar', 'playable'],
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: true });
    });

    it('should accept a dedicated world master with one playable character', () => {
        const response = service.validate({
            characterIds: ['playable'],
            worldMasterId: 'wm-entity',
            charactersControlledByAi: [],
        });

        expect(response).toEqual({ success: true });
    });

    it('should accept AI controlled characters next to the playable ones and the world master character', () => {
        const response = service.validate({
            characterIds: ['playable1', 'playable2', 'wmChar', 'ai'],
            characterAsWorldMasterId: 'wmChar',
            charactersControlledByAi: ['ai'],
        });

        expect(response).toEqual({ success: true });
    });
});
