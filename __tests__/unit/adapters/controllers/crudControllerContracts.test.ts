import {
    CreateAbilityController,
    CreateAssistantController,
    CreateCharacterController,
    CreateConnectionConfigController,
    CreateItemController,
    CreateLocationController,
    CreateProficiencyController,
    CreateSamplerController,
    CreateStatusController,
    CreateSystemPromptController,
    CreateWorldController,
    CreateWorldMasterController,
    EditAbilityController,
    EditAssistantController,
    EditCharacterController,
    EditConnectionController,
    EditItemController,
    EditLocationController,
    EditProficiencyController,
    EditSamplerController,
    EditStatusController,
    EditSystemPromptController,
    EditWorldController,
    EditWorldMasterController,
    EraseAbilityController,
    EraseItemController,
    EraseLocationController,
    EraseStatusController,
    EraseProficiencyController,
    EraseWorldController,
    EraseWorldMasterController,
    EraseCharacterController,
    EraseAssistantController,
    EraseSystemPromptController,
    EraseConnectionController,
    EraseSamplerController,
    GetAbilitiesController,
    GetAbilityController,
    GetAssistantController,
    GetAssistantsController,
    GetCharacterController,
    GetCharactersController,
    GetConnectionController,
    GetConnectionsController,
    GetItemController,
    GetItemsController,
    GetLocationController,
    GetLocationsController,
    GetProficienciesController,
    GetProficiencyController,
    GetSamplerController,
    GetSamplersController,
    GetStatusController,
    GetStatusesController,
    GetSystemPromptController,
    GetSystemPromptsController,
    GetWorldController,
    GetWorldMasterController,
    GetWorldMastersController,
    GetWorldsController,
} from '@adapters/controllers';
import {
    GetAbilitiesPresenter,
    GetAbilityPresenter,
    GetAssistantPresenter,
    GetAssistantsPresenter,
    GetCharacterPresenter,
    GetCharactersPresenter,
    GetConnectionPresenter,
    GetConnectionsPresenter,
    GetItemPresenter,
    GetItemsPresenter,
    GetLocationPresenter,
    GetLocationsPresenter,
    GetProficienciesPresenter,
    GetProficiencyPresenter,
    GetSamplerPresenter,
    GetSamplersPresenter,
    GetStatusPresenter,
    GetStatusesPresenter,
    GetSystemPromptPresenter,
    GetSystemPromptsPresenter,
    GetWorldMasterPresenter,
    GetWorldMastersPresenter,
    GetWorldPresenter,
    GetWorldsPresenter,
} from '@adapters/presenters';
import { ILogger } from '@domain/logger';
import {
    createAbilityHelper,
    createAssistantHelper,
    createCharacterHelper,
    createConnectionHelper,
    createItemHelper,
    createLocationHelper,
    createProficiencyHelper,
    createSamplerHelper,
    createStatusHelper,
    createSystemPromptHelper,
    createWorldHelper,
    createWorldMasterHelper,
} from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

type Handler = { handle: (...args: never[]) => Promise<Record<string, unknown>>; };
type ControllerClass = new (logger: ILogger, useCase: never, presenter?: never) => Handler;

const ACTIVATION_DETAIL_KEYS = ['id', 'name', 'activationWord', 'prompt', 'observation'];

const ENTITIES = [
    { label: 'ability', field: 'ability', plural: 'abilities', entity: createAbilityHelper(), List: GetAbilitiesController, ListPresenter: GetAbilitiesPresenter, Detail: GetAbilityController, DetailPresenter: GetAbilityPresenter, Create: CreateAbilityController, Edit: EditAbilityController, Erase: EraseAbilityController, listKeys: ['id', 'name', 'activationWord'], detailKeys: ACTIVATION_DETAIL_KEYS },
    { label: 'item', field: 'item', plural: 'items', entity: createItemHelper(), List: GetItemsController, ListPresenter: GetItemsPresenter, Detail: GetItemController, DetailPresenter: GetItemPresenter, Create: CreateItemController, Edit: EditItemController, Erase: EraseItemController, listKeys: ['id', 'name', 'activationWord'], detailKeys: ACTIVATION_DETAIL_KEYS },
    { label: 'location', field: 'location', plural: 'locations', entity: createLocationHelper(), List: GetLocationsController, ListPresenter: GetLocationsPresenter, Detail: GetLocationController, DetailPresenter: GetLocationPresenter, Create: CreateLocationController, Edit: EditLocationController, Erase: EraseLocationController, listKeys: ['id', 'name', 'activationWord'], detailKeys: ACTIVATION_DETAIL_KEYS },
    { label: 'status', field: 'status', plural: 'statuses', entity: createStatusHelper(), List: GetStatusesController, ListPresenter: GetStatusesPresenter, Detail: GetStatusController, DetailPresenter: GetStatusPresenter, Create: CreateStatusController, Edit: EditStatusController, Erase: EraseStatusController, listKeys: ['id', 'name', 'activationWord'], detailKeys: ACTIVATION_DETAIL_KEYS },
    { label: 'proficiency', field: 'proficiency', plural: 'proficiencies', entity: createProficiencyHelper(), List: GetProficienciesController, ListPresenter: GetProficienciesPresenter, Detail: GetProficiencyController, DetailPresenter: GetProficiencyPresenter, Create: CreateProficiencyController, Edit: EditProficiencyController, Erase: EraseProficiencyController, listKeys: ['id', 'name', 'activationWord'], detailKeys: ACTIVATION_DETAIL_KEYS },
    { label: 'world', field: 'world', plural: 'worlds', entity: createWorldHelper(), List: GetWorldsController, ListPresenter: GetWorldsPresenter, Detail: GetWorldController, DetailPresenter: GetWorldPresenter, Create: CreateWorldController, Edit: EditWorldController, Erase: EraseWorldController, listKeys: ['id', 'name', 'activationWord'], detailKeys: ACTIVATION_DETAIL_KEYS },
    { label: 'world master', field: 'worldMaster', plural: 'worldMasters', entity: createWorldMasterHelper(), List: GetWorldMastersController, ListPresenter: GetWorldMastersPresenter, Detail: GetWorldMasterController, DetailPresenter: GetWorldMasterPresenter, Create: CreateWorldMasterController, Edit: EditWorldMasterController, Erase: EraseWorldMasterController, listKeys: ['id', 'name', 'activationWord'], detailKeys: [...ACTIVATION_DETAIL_KEYS, 'assistantId'] },
    { label: 'character', field: 'character', plural: 'characters', entity: createCharacterHelper(), List: GetCharactersController, ListPresenter: GetCharactersPresenter, Detail: GetCharacterController, DetailPresenter: GetCharacterPresenter, Create: CreateCharacterController, Edit: EditCharacterController, Erase: EraseCharacterController, listKeys: ['id', 'name', 'activationWord'], detailKeys: [...ACTIVATION_DETAIL_KEYS, 'assistantId', 'abilityIds', 'proficiencyIds', 'statusIds', 'attributes'] },
    { label: 'assistant', field: 'assistant', plural: 'assistants', entity: createAssistantHelper(), List: GetAssistantsController, ListPresenter: GetAssistantsPresenter, Detail: GetAssistantController, DetailPresenter: GetAssistantPresenter, Create: CreateAssistantController, Edit: EditAssistantController, Erase: EraseAssistantController, listKeys: ['id', 'name'], detailKeys: ['id', 'name', 'observation', 'modelId', 'samplerId', 'connectionId'] },
    { label: 'system prompt', field: 'systemPrompt', plural: 'systemPrompts', entity: createSystemPromptHelper(), List: GetSystemPromptsController, ListPresenter: GetSystemPromptsPresenter, Detail: GetSystemPromptController, DetailPresenter: GetSystemPromptPresenter, Create: CreateSystemPromptController, Edit: EditSystemPromptController, Erase: EraseSystemPromptController, listKeys: ['id', 'name', 'content'], detailKeys: ['id', 'name', 'content', 'observation'] },
    { label: 'connection', field: 'connection', plural: 'connections', entity: createConnectionHelper({ auth: 'secret' }), List: GetConnectionsController, ListPresenter: GetConnectionsPresenter, Detail: GetConnectionController, DetailPresenter: GetConnectionPresenter, Create: CreateConnectionConfigController, Edit: EditConnectionController, Erase: EraseConnectionController, listKeys: ['id', 'name', 'ip', 'port'], detailKeys: ['id', 'name', 'ip', 'port', 'auth'] },
    { label: 'sampler', field: 'sampler', plural: 'samplers', entity: createSamplerHelper({ temperature: 0.7 }), List: GetSamplersController, ListPresenter: GetSamplersPresenter, Detail: GetSamplerController, DetailPresenter: GetSamplerPresenter, Create: CreateSamplerController, Edit: EditSamplerController, Erase: EraseSamplerController, listKeys: null, detailKeys: null },
] as const;

function build (Controller: unknown, execute: jest.Mock, Presenter?: unknown): Handler {
    const presenter = Presenter ? new (Presenter as new () => never)() : undefined;
    return new (Controller as ControllerClass)(logger, { execute } as never, presenter);
}

function definedKeys (value: object): string[] {
    return Object.entries(value).filter(([, v]) => v !== undefined).map(([key]) => key).sort();
}

describe.each(ENTITIES)('$label controllers', ({ label, field, plural, entity, List, ListPresenter, Detail, DetailPresenter, Create, Edit, Erase, listKeys, detailKeys }) => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lists only the fields the list renders inside a success envelope', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, [plural]: [entity] });

        const response = await build(List, execute, ListPresenter).handle();

        expect(response.success).toBe(true);
        const items = response.items as Record<string, unknown>[];
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe(entity.id);
        expect(items[0]).not.toHaveProperty('createdAt');
        expect(items[0]).not.toHaveProperty('updatedAt');
        if (listKeys) {
            expect(Object.keys(items[0]).sort()).toEqual([...listKeys].sort());
        }
    });

    it('forwards the error envelope when listing fails', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await build(List, execute, ListPresenter).handle();

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('loads the edit form details by id', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, [field]: entity });

        const response = await build(Detail, execute, DetailPresenter).handle({ id: entity.id } as never);

        expect(execute).toHaveBeenCalledWith({ id: entity.id });
        expect(response.success).toBe(true);
        const data = response.data as Record<string, unknown>;
        expect(data.id).toBe(entity.id);
        expect(data).not.toHaveProperty('createdAt');
        if (detailKeys) {
            expect([...detailKeys]).toEqual(expect.arrayContaining(definedKeys(data)));
        }
    });

    it(`forwards the not found error when the ${label} does not exist`, async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'not found' });

        const response = await build(Detail, execute, DetailPresenter).handle({ id: 'missing' } as never);

        expect(response).toEqual({ success: false, error: 'not found' });
    });

    it('erases by an id object, like every other request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await build(Erase, execute).handle({ id: entity.id } as never);

        expect(execute).toHaveBeenCalledWith({ id: entity.id });
        expect(response).toEqual({ success: true });
    });

    it.each([['create', Create], ['edit', Edit]] as const)('forwards the id the %s use case returns', async (_kind, Controller) => {
        const execute = jest.fn().mockResolvedValue({ success: true, id: entity.id });

        const response = await build(Controller, execute).handle({ id: entity.id, editParams: {}, name: 'x' } as never);

        expect(execute).toHaveBeenCalledTimes(1);
        expect(response).toEqual({ success: true, id: entity.id });
        expect(definedKeys(response)).toEqual(['id', 'success']);
    });

    it.each([['create', Create], ['edit', Edit]] as const)('forwards the %s error', async (_kind, Controller) => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'invalid' });

        const response = await build(Controller, execute).handle({ id: entity.id, editParams: {}, name: 'x' } as never);

        expect(response).toEqual({ success: false, error: 'invalid' });
    });
});

describe('connection list', () => {
    it('never exposes the auth secret', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, connections: [createConnectionHelper({ auth: 'secret' })] });

        const response = await build(GetConnectionsController, execute, GetConnectionsPresenter).handle();

        expect(JSON.stringify(response)).not.toContain('secret');
    });
});

describe('sampler views', () => {
    it('lists samplers with their parameters and the system default flag', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, samplers: [createSamplerHelper({ id: 's1', name: 'warm', temperature: 0.7, systemDefault: true })] });

        const response = await build(GetSamplersController, execute, GetSamplersPresenter).handle();

        expect(response.items).toEqual([expect.objectContaining({ id: 's1', name: 'warm', temperature: 0.7, systemDefault: true })]);
    });

    it('omits the system default flag and timestamps from the edit form details', async () => {
        const sampler = createSamplerHelper({ id: 's1', temperature: 0.7 });
        const execute = jest.fn().mockResolvedValue({ success: true, sampler });

        const response = await build(GetSamplerController, execute, GetSamplerPresenter).handle({ id: 's1' } as never);

        const data = response.data as Record<string, unknown>;
        expect(data.temperature).toBe(0.7);
        expect(data).not.toHaveProperty('systemDefault');
        expect(data).not.toHaveProperty('createdAt');
    });
});
