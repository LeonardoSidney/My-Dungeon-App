import {
    AssistantDTO,
    ItemDTO,
    LocationDTO,
    ProficiencyDTO,
    StatusDTO,
    SystemPromptDTO,
    ThinkDTO,
    WorldDTO,
    WorldMasterDTO,
} from '@infra/dto';

type DTOClass = { fromStorage: (data: unknown) => { toEntity: () => unknown; } | null; };

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');
const DATES = { createdAt: createdAt.toISOString(), updatedAt: updatedAt.toISOString() };
const PARSED_DATES = { createdAt, updatedAt };

const RESOURCE = {
    id: 'e1',
    name: 'Stored entity',
    activationWord: 'activate',
    prompt: 'Entity prompt',
    observation: 'Entity observation'
};
const RESOURCE_INVALID_FIELDS: Array<[string, unknown]> = [
    ['id', 1],
    ['name', undefined],
    ['activationWord', false],
    ['prompt', null],
    ['observation', 3],
    ['createdAt', 'not a date'],
    ['updatedAt', undefined]
];

const CASES: Array<{ DTO: DTOClass; stored: Record<string, unknown>; entity: Record<string, unknown>; optional: string; invalid: Array<[string, unknown]>; }> = [
    ...[ItemDTO, LocationDTO, ProficiencyDTO, StatusDTO, WorldDTO].map(DTO => ({
        DTO,
        stored: { ...RESOURCE, ...DATES },
        entity: { ...RESOURCE, ...PARSED_DATES },
        optional: 'observation',
        invalid: RESOURCE_INVALID_FIELDS
    })),
    {
        DTO: WorldMasterDTO,
        stored: { ...RESOURCE, assistantId: 'assistant-1', ...DATES },
        entity: { ...RESOURCE, assistantId: 'assistant-1', ...PARSED_DATES },
        optional: 'observation',
        invalid: [...RESOURCE_INVALID_FIELDS, ['assistantId', 42]]
    },
    {
        DTO: AssistantDTO,
        stored: { id: 'e1', name: 'Narrator', observation: 'Main assistant', modelId: 'model-1', samplerId: 'sampler-1', connectionId: 'connection-1', ...DATES },
        entity: { id: 'e1', name: 'Narrator', observation: 'Main assistant', modelId: 'model-1', samplerId: 'sampler-1', connectionId: 'connection-1', ...PARSED_DATES },
        optional: 'observation',
        invalid: [['id', 1], ['name', null], ['observation', 3], ['modelId', undefined], ['samplerId', 2], ['connectionId', false], ['createdAt', 'not a date'], ['updatedAt', undefined]]
    },
    {
        DTO: SystemPromptDTO,
        stored: { id: 'e1', name: 'Rules', content: 'Be a fair narrator', observation: 'Default rules', ...DATES },
        entity: { id: 'e1', name: 'Rules', content: 'Be a fair narrator', observation: 'Default rules', ...PARSED_DATES },
        optional: 'observation',
        invalid: [['id', 1], ['name', null], ['content', 42], ['observation', 3], ['createdAt', 'not a date'], ['updatedAt', undefined]]
    },
    {
        DTO: ThinkDTO,
        stored: { id: 'think-1', content: 'reasoning', enabled: true },
        entity: { id: 'think-1', content: 'reasoning', enabled: true },
        optional: 'content',
        invalid: [['id', 1], ['content', 42], ['enabled', 'true']]
    },
];

describe.each(CASES)('$DTO.name', ({ DTO, stored, entity, optional, invalid }) => {
    it('converts a stored value into an entity', () => {
        expect(DTO.fromStorage(stored)?.toEntity()).toEqual(entity);
    });

    it(`accepts a stored value without the optional ${optional}`, () => {
        expect(DTO.fromStorage({ ...stored, [optional]: undefined })?.toEntity()).toEqual({ ...entity, [optional]: undefined });
    });

    it.each([null, 'text', 42])('rejects %p because it is not a record', (data) => {
        expect(DTO.fromStorage(data)).toBeNull();
    });

    it.each(invalid)('rejects a stored value with an invalid %s', (field, value) => {
        expect(DTO.fromStorage({ ...stored, [field]: value })).toBeNull();
    });
});
