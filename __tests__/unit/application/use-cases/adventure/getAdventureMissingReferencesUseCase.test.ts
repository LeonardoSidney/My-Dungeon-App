import { GetAdventureMissingReferencesUseCase } from '@application/use-cases';
import { MissingReferenceKindEnum, MissingReferenceOwnerEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const missingReference = {
    owner: MissingReferenceOwnerEnum.CHARACTER,
    ownerName: 'Hero',
    kind: MissingReferenceKindEnum.ABILITY,
    id: 'ability',
};

describe('GetAdventureMissingReferencesUseCase', () => {
    function build (adventureResponse: unknown = { success: true, adventure: createAdventureHelper() }) {
        const adventureRepository = { getAdventureById: jest.fn().mockResolvedValue(adventureResponse) };
        const service = { find: jest.fn().mockResolvedValue({ success: true, missingReferences: [missingReference] }) };
        const useCase = new GetAdventureMissingReferencesUseCase(logger, adventureRepository as never, service);
        return { useCase, adventureRepository, service };
    }

    it('returns the missing references of the adventure', async () => {
        const { useCase, service } = build();

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(service.find).toHaveBeenCalledWith({ adventure: createAdventureHelper() });
        expect(response).toEqual({ success: true, missingReferences: [missingReference] });
    });

    it('fails without reading the adventure when the id is blank', async () => {
        const { useCase, adventureRepository } = build();

        const response = await useCase.execute({ adventureId: '  ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('propagates a failure to load the adventure', async () => {
        const { useCase } = build({ success: false, error: 'storage offline' });

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('fails when the adventure does not exist', async () => {
        const { useCase } = build({ success: true, adventure: undefined });

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adventure-1 not found' });
    });

    it('propagates a failure of the service', async () => {
        const { useCase, service } = build();
        service.find.mockResolvedValue({ success: false, error: 'corrupted items' });

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'corrupted items' });
    });

    it('fails with a generic error when the service fails without a message', async () => {
        const { useCase, service } = build();
        service.find.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to check the adventure references' });
    });
});
