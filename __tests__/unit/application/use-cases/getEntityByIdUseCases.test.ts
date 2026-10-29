import {
    GetAbilityByIdUseCase,
    GetAssistantByIdUseCase,
    GetCharacterByIdUseCase,
    GetConnectionByIdUseCase,
    GetItemByIdUseCase,
    GetLocationByIdUseCase,
    GetProficiencyByIdUseCase,
    GetStatusByIdUseCase,
    GetSystemPromptByIdUseCase,
    GetWorldByIdUseCase,
    GetWorldMasterByIdUseCase,
} from '@application/use-cases';
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

type UseCase = { execute: (params: { id: string; }) => Promise<Record<string, unknown>>; };
type UseCaseClass = new (logger: ILogger, repository: never) => UseCase;

const CASES = [
    { UseCase: GetAbilityByIdUseCase, method: 'getAbilityById', field: 'ability', label: 'Ability' },
    { UseCase: GetItemByIdUseCase, method: 'getItemById', field: 'item', label: 'Item' },
    { UseCase: GetLocationByIdUseCase, method: 'getLocationById', field: 'location', label: 'Location' },
    { UseCase: GetStatusByIdUseCase, method: 'getStatusById', field: 'status', label: 'Status' },
    { UseCase: GetProficiencyByIdUseCase, method: 'getProficiencyById', field: 'proficiency', label: 'Proficiency' },
    { UseCase: GetWorldByIdUseCase, method: 'getWorldById', field: 'world', label: 'World' },
    { UseCase: GetWorldMasterByIdUseCase, method: 'getWorldMasterById', field: 'worldMaster', label: 'World master' },
    { UseCase: GetCharacterByIdUseCase, method: 'getCharacterById', field: 'character', label: 'Character' },
    { UseCase: GetAssistantByIdUseCase, method: 'getAssistantById', field: 'assistant', label: 'Assistant' },
    { UseCase: GetSystemPromptByIdUseCase, method: 'getSystemPromptById', field: 'systemPrompt', label: 'System prompt' },
    { UseCase: GetConnectionByIdUseCase, method: 'getConnectionById', field: 'connection', label: 'Connection' },
] as const;

describe.each(CASES)('$UseCase.name', ({ UseCase, method, field, label }) => {
    function build (lookup: jest.Mock): UseCase {
        return new (UseCase as unknown as UseCaseClass)(logger, { [method]: lookup } as never);
    }

    it('returns the stored entity', async () => {
        const entity = { id: 'e1', name: 'stored' };
        const lookup = jest.fn().mockResolvedValue({ success: true, [field]: entity });

        const response = await build(lookup).execute({ id: 'e1' });

        expect(lookup).toHaveBeenCalledWith('e1');
        expect(response).toEqual({ success: true, [field]: entity });
    });

    it('fails when the entity does not exist', async () => {
        const response = await build(jest.fn().mockResolvedValue({ success: true })).execute({ id: 'missing' });

        expect(response).toEqual({ success: false, error: `${label} with id missing not found` });
    });

    it('propagates a repository failure as an error result', async () => {
        const response = await build(jest.fn().mockResolvedValue({ success: false, error: 'storage offline' })).execute({ id: 'e1' });

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('fails without querying when the id is blank', async () => {
        const lookup = jest.fn();

        const response = await build(lookup).execute({ id: '  ' });

        expect(response).toEqual({ success: false, error: `${label} id is required` });
        expect(lookup).not.toHaveBeenCalled();
    });
});
