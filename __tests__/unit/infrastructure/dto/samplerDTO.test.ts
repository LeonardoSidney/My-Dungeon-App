import { SamplerDTO } from '@infra/dto';
import { MirostatEnum } from '@domain/entities';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const NUMBER_FIELDS = [
    'adaptativeDecay', 'adaptativeTarget', 'dryAllowedLenght', 'dryBase', 'dryMultiplier', 'dynaTempExp', 'dynaTempRange',
    'minP', 'mirostat', 'mirostatEnt', 'mirostatLr', 'frequencyPenalty', 'presencePenalty', 'repeatLastN', 'repeatPenalty',
    'temperature', 'topK', 'topNSigma', 'topP', 'typicalP', 'xtcProbability', 'xtcThreshould'
];
const OPTIONAL_FIELDS = [...NUMBER_FIELDS, 'observation', 'drySequenceBreakers', 'ignoreEOS', 'seed'];

const STORED: Record<string, unknown> = {
    id: 'sampler-1',
    name: 'Creative',
    observation: 'For narration',
    systemDefault: false,
    drySequenceBreakers: '\n',
    ignoreEOS: false,
    seed: '42',
    ...Object.fromEntries(NUMBER_FIELDS.map((field, index) => [field, index + 1])),
    mirostat: MirostatEnum.MIROSTAT2,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('SamplerDTO', () => {
    it('converts a stored sampler with every parameter into an entity with parsed dates', () => {
        expect(SamplerDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('accepts a sampler with only the required fields', () => {
        const minimal = Object.fromEntries(Object.entries(STORED).filter(([field]) => !OPTIONAL_FIELDS.includes(field)));

        expect(SamplerDTO.fromStorage(minimal)?.toEntity()).toEqual({
            ...Object.fromEntries(OPTIONAL_FIELDS.map(field => [field, undefined])),
            id: 'sampler-1',
            name: 'Creative',
            systemDefault: false,
            createdAt,
            updatedAt
        });
    });

    it.each([null, 'sampler', 42])('rejects %p because it is not a record', (data) => {
        expect(SamplerDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['name', undefined],
        ['observation', 3],
        ['systemDefault', 'false'],
        ['drySequenceBreakers', 1],
        ['ignoreEOS', 'true'],
        ['seed', 42],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined],
        ...NUMBER_FIELDS.map((field): [string, unknown] => [field, 'not a number'])
    ])('rejects a stored sampler with an invalid %s', (field, value) => {
        expect(SamplerDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
