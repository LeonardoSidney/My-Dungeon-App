import { GetAdventureCharactersUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createCharacterHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GetAdventureCharactersUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('reads each character of the adventure and skips the missing ones', async () => {
        const adventure = createAdventureHelper({ characterIds: ['hero', 'gone'] });
        const characterRepository = { getCharacterById: jest.fn(async (id: string) => ({ success: true, character: id === 'hero' ? createCharacterHelper({ id: 'hero' }) : undefined })) };
        const useCase = new GetAdventureCharactersUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure }) } as never, characterRepository as never);

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(characterRepository.getCharacterById.mock.calls.map(([id]) => id)).toEqual(['hero', 'gone']);
        expect(response.characters?.map(character => character.id)).toEqual(['hero']);
    });

    it('fails when the adventure does not exist', async () => {
        const useCase = new GetAdventureCharactersUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: undefined }) } as never, {} as never);

        const response = await useCase.execute({ adventureId: 'missing' });

        expect(response).toEqual({ success: false, error: 'Adventure with id missing not found' });
    });

    it('returns every character when all of them are found', async () => {
        const adventure = createAdventureHelper({ characterIds: ['hero'] });
        const characterRepository = { getCharacterById: jest.fn(async (id: string) => ({ success: true, character: createCharacterHelper({ id }) })) };
        const useCase = new GetAdventureCharactersUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure }) } as never, characterRepository as never);

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(response.characters?.map(character => character.id)).toEqual(['hero']);
        expect(logger.warning).not.toHaveBeenCalled();
    });

    it('fails without reading the adventure when the id is blank', async () => {
        const adventureRepository = { getAdventureById: jest.fn() };
        const useCase = new GetAdventureCharactersUseCase(logger, adventureRepository as never, {} as never);

        const response = await useCase.execute({ adventureId: ' ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('propagates a failure to load the adventure', async () => {
        const useCase = new GetAdventureCharactersUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue({ success: false, error: 'storage offline' }) } as never, {} as never);

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('propagates a failure to load one of the characters', async () => {
        const adventure = createAdventureHelper({ characterIds: ['hero', 'broken'] });
        const characterRepository = { getCharacterById: jest.fn(async (id: string) => (id === 'broken' ? { success: false, error: 'corrupted character' } : { success: true, character: createCharacterHelper({ id }) })) };
        const useCase = new GetAdventureCharactersUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure }) } as never, characterRepository as never);

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(response).toEqual({ success: false, error: 'corrupted character' });
    });
});
