import { SamplerDTO } from '@infra/dto';
import { MirostatEnum } from '@domain/entities';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const NUMBER_FIELDS = [
    'adaptiveDecay', 'adaptiveTarget', 'dryAllowedLength', 'dryBase', 'dryMultiplier', 'dynaTempExp', 'dynaTempRange',
    'minP', 'mirostat', 'mirostatEnt', 'mirostatLr', 'frequencyPenalty', 'presencePenalty', 'repeatLastN', 'repeatPenalty',
    'temperature', 'topK', 'topNSigma', 'topP', 'typicalP', 'xtcProbability', 'xtcThreshold'
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

function createLegacyStored (): Record<string, unknown> {
    const stored: Record<string, unknown> = {
        ...STORED,
        adaptativeDecay: 0.7,
        adaptativeTarget: 0.4,
        dryAllowedLenght: 5,
        xtcThreshould: 0.2
    };
    delete stored.adaptiveDecay;
    delete stored.adaptiveTarget;
    delete stored.dryAllowedLength;
    delete stored.xtcThreshold;

    return stored;
}

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

    it('rejects null because it is not a record', () => {
        expect(SamplerDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "sampler" because it is not a record', () => {
        expect(SamplerDTO.fromStorage('sampler')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(SamplerDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored sampler with an invalid id', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored sampler with an invalid name', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects a stored sampler with an invalid observation', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, observation: 3 })).toBeNull();
    });

    it('rejects a stored sampler with an invalid systemDefault', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, systemDefault: 'false' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid drySequenceBreakers', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, drySequenceBreakers: 1 })).toBeNull();
    });

    it('rejects a stored sampler with an invalid ignoreEOS', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, ignoreEOS: 'true' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid seed', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, seed: 42 })).toBeNull();
    });

    it('rejects a stored sampler with an invalid createdAt', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid updatedAt', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });

    it('rejects a stored sampler with an invalid adaptiveDecay', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, adaptiveDecay: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid adaptiveTarget', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, adaptiveTarget: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid dryAllowedLength', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, dryAllowedLength: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid dryBase', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, dryBase: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid dryMultiplier', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, dryMultiplier: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid dynaTempExp', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, dynaTempExp: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid dynaTempRange', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, dynaTempRange: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid minP', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, minP: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid mirostat', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, mirostat: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid mirostatEnt', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, mirostatEnt: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid mirostatLr', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, mirostatLr: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid frequencyPenalty', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, frequencyPenalty: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid presencePenalty', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, presencePenalty: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid repeatLastN', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, repeatLastN: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid repeatPenalty', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, repeatPenalty: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid temperature', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, temperature: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid topK', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, topK: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid topNSigma', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, topNSigma: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid topP', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, topP: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid typicalP', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, typicalP: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid xtcProbability', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, xtcProbability: 'not a number' })).toBeNull();
    });

    it('rejects a stored sampler with an invalid xtcThreshold', () => {
        expect(SamplerDTO.fromStorage({ ...STORED, xtcThreshold: 'not a number' })).toBeNull();
    });

    it('reads the adaptive fields saved under the legacy spelling', () => {
        const entity = SamplerDTO.fromStorage(createLegacyStored())?.toEntity();

        expect(entity?.adaptiveDecay).toBe(0.7);
        expect(entity?.adaptiveTarget).toBe(0.4);
    });

    it('reads the dry allowed length saved under the legacy spelling', () => {
        expect(SamplerDTO.fromStorage(createLegacyStored())?.toEntity().dryAllowedLength).toBe(5);
    });

    it('reads the xtc threshold saved under the legacy spelling', () => {
        expect(SamplerDTO.fromStorage(createLegacyStored())?.toEntity().xtcThreshold).toBe(0.2);
    });

    it('does not expose the legacy spelling on the entity', () => {
        const entity = SamplerDTO.fromStorage(createLegacyStored())?.toEntity();

        expect(entity).not.toHaveProperty('dryAllowedLenght');
        expect(entity).not.toHaveProperty('xtcThreshould');
        expect(entity).not.toHaveProperty('adaptativeDecay');
        expect(entity).not.toHaveProperty('adaptativeTarget');
    });

    it('prefers the current spelling when both are stored', () => {
        const stored = { ...createLegacyStored(), dryAllowedLength: 9 };

        expect(SamplerDTO.fromStorage(stored)?.toEntity().dryAllowedLength).toBe(9);
    });

    it('rejects a stored sampler with an invalid value under the legacy spelling', () => {
        expect(SamplerDTO.fromStorage({ ...createLegacyStored(), dryAllowedLenght: 'not a number' })).toBeNull();
    });
});
