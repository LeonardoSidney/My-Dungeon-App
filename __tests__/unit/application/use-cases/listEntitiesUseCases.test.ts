import {
    GetAbilitiesUseCase,
    GetAdventuresUseCase,
    GetAssistantsUseCase,
    GetCharactersUseCase,
    GetConnectionsUseCase,
    GetItemsUseCase,
    GetLocationsUseCase,
    GetProficienciesUseCase,
    GetSamplersUseCase,
    GetStatusesUseCase,
    GetSystemPromptsUseCase,
    GetWorldMastersUseCase,
    GetWorldsUseCase,
} from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createSamplerHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

type UseCase = { execute: () => Promise<Record<string, unknown>>; };
type UseCaseClass = new (logger: ILogger, repository: never) => UseCase;

const CASES = [
    { UseCase: GetAbilitiesUseCase, method: 'getAbilities', field: 'abilities' },
    { UseCase: GetItemsUseCase, method: 'getItems', field: 'items' },
    { UseCase: GetLocationsUseCase, method: 'getLocations', field: 'locations' },
    { UseCase: GetStatusesUseCase, method: 'getStatuses', field: 'statuses' },
    { UseCase: GetProficienciesUseCase, method: 'getProficiencies', field: 'proficiencies' },
    { UseCase: GetWorldsUseCase, method: 'getWorlds', field: 'worlds' },
    { UseCase: GetWorldMastersUseCase, method: 'getWorldMasters', field: 'worldMasters' },
    { UseCase: GetCharactersUseCase, method: 'getCharacters', field: 'characters' },
    { UseCase: GetAssistantsUseCase, method: 'getAssistants', field: 'assistants' },
    { UseCase: GetSystemPromptsUseCase, method: 'getSystemPrompts', field: 'systemPrompts' },
    { UseCase: GetConnectionsUseCase, method: 'getConnections', field: 'connections' },
    { UseCase: GetAdventuresUseCase, method: 'getAdventures', field: 'adventures' },
] as const;

describe.each(CASES)('$UseCase.name', ({ UseCase, method, field }) => {
    function build (lookup: jest.Mock): UseCase {
        return new (UseCase as unknown as UseCaseClass)(logger, { [method]: lookup } as never);
    }

    it('wraps the stored entities in a success result', async () => {
        const entities = [{ id: 'e1', name: 'stored' }];

        const response = await build(jest.fn().mockResolvedValue({ success: true, [field]: entities })).execute();

        expect(response).toEqual({ success: true, [field]: entities });
    });

    it('propagates a repository failure as an error result', async () => {
        const response = await build(jest.fn().mockResolvedValue({ success: false, error: 'storage offline' })).execute();

        expect(response).toEqual({ success: false, error: 'storage offline' });
        expect(logger.warning).toHaveBeenCalled();
    });
});

describe('GetSamplersUseCase', () => {
    const service = { getSystemDefaultSamplers: jest.fn().mockReturnValue([createSamplerHelper({ id: 'default', systemDefault: true })]) };

    it('lists the system defaults before the stored samplers', async () => {
        const stored = createSamplerHelper({ id: 'stored' });
        const useCase = new GetSamplersUseCase(logger, service as never, { getSamplers: jest.fn().mockResolvedValue({ success: true, samplers: [stored] }) } as never);

        const response = await useCase.execute();

        expect(response.samplers?.map(sampler => sampler.id)).toEqual(['default', 'stored']);
    });

    it('propagates a repository failure as an error result', async () => {
        const useCase = new GetSamplersUseCase(logger, service as never, { getSamplers: jest.fn().mockResolvedValue({ success: false, error: 'storage offline' }) } as never);

        const response = await useCase.execute();

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });
});
