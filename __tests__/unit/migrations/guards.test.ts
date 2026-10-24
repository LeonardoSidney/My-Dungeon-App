import {
    isSeedAbility,
    isSeedAdventure,
    isSeedAssistant,
    isSeedCharacter,
    isSeedConnection,
    isSeedItem,
    isSeedLocation,
    isSeedProficiency,
    isSeedSampler,
    isSeedStatus,
    isSeedSystemPrompt,
    isSeedWorld,
    isSeedWorldMaster,
    parseSeedArray,
} from '@src/migrations/guards';
import { MirostatEnum } from '@domain/entities';

type Guard = (value: unknown) => boolean;

const RESOURCE = { name: 'Entity', activationWord: 'activate', prompt: 'Entity prompt', observation: 'Entity observation' };
const RESOURCE_INVALID: Array<[string, unknown]> = [
    ['name', ''],
    ['activationWord', undefined],
    ['prompt', 42],
    ['observation', '']
];

const CASES: Array<{ guard: Guard; valid: Record<string, unknown>; optional: string[]; invalid: Array<[string, unknown]>; }> = [
    ...[isSeedAbility, isSeedStatus, isSeedProficiency, isSeedWorld, isSeedLocation, isSeedItem].map(guard => ({
        guard,
        valid: RESOURCE,
        optional: ['observation'],
        invalid: RESOURCE_INVALID
    })),
    {
        guard: isSeedWorldMaster,
        valid: { ...RESOURCE, assistant: 'Narrator' },
        optional: ['observation'],
        invalid: [...RESOURCE_INVALID, ['assistant', '']]
    },
    {
        guard: isSeedConnection,
        valid: { name: 'Local', ip: 'localhost', port: 8080, auth: 'Bearer token' },
        optional: ['port', 'auth'],
        invalid: [['name', ''], ['ip', undefined], ['port', '8080'], ['auth', '']]
    },
    {
        guard: isSeedAssistant,
        valid: { name: 'Narrator', modelId: 'local-model', sampler: 'Creative', observation: 'Main assistant' },
        optional: ['observation'],
        invalid: [['name', ''], ['modelId', undefined], ['sampler', 42], ['observation', '']]
    },
    {
        guard: isSeedSystemPrompt,
        valid: { name: 'Rules', content: 'Be fair', observation: 'Default rules' },
        optional: ['observation'],
        invalid: [['name', ''], ['content', undefined], ['observation', '']]
    },
    {
        guard: isSeedCharacter,
        valid: {
            ...RESOURCE,
            assistant: 'Narrator',
            abilities: ['Fireball'],
            proficiencies: ['Swords'],
            statuses: ['Healthy'],
            attributes: [{ name: 'Strength', value: 10 }]
        },
        optional: ['observation', 'abilities', 'proficiencies', 'statuses', 'attributes'],
        invalid: [
            ...RESOURCE_INVALID,
            ['assistant', ''],
            ['abilities', 'Fireball'],
            ['proficiencies', [1]],
            ['statuses', null],
            ['attributes', 'Strength'],
            ['attributes', [{ name: '', value: 10 }]],
            ['attributes', [{ name: 'Strength', value: '10' }]],
            ['attributes', ['Strength']]
        ]
    },
    {
        guard: isSeedAdventure,
        valid: {
            name: 'Quest',
            characters: ['Hero'],
            systemPrompts: ['Rules'],
            worlds: ['World'],
            locations: ['Tavern'],
            items: ['Sword'],
            charactersControlledByAi: [],
            worldMaster: 'Narrator'
        },
        optional: ['worldMaster'],
        invalid: [
            ['name', ''],
            ['characters', undefined],
            ['systemPrompts', 'Rules'],
            ['worlds', [1]],
            ['locations', null],
            ['items', {}],
            ['charactersControlledByAi', undefined],
            ['worldMaster', '']
        ]
    },
    {
        guard: isSeedSampler,
        valid: {
            name: 'Creative',
            temperature: 0.8,
            topK: 40,
            mirostat: MirostatEnum.MIROSTAT2,
            observation: 'For narration',
            drySequenceBreakers: '\n',
            seed: '42',
            ignoreEOS: false
        },
        optional: ['temperature', 'topK', 'mirostat', 'observation', 'drySequenceBreakers', 'seed', 'ignoreEOS'],
        invalid: [
            ['name', ''],
            ['temperature', '0.8'],
            ['xtcThreshould', null],
            ['mirostat', 3],
            ['observation', ''],
            ['drySequenceBreakers', 1],
            ['seed', 42],
            ['ignoreEOS', 'false']
        ]
    },
];

describe.each(CASES)('$guard.name', ({ guard, valid, optional, invalid }) => {
    it('accepts a complete seed', () => {
        expect(guard(valid)).toBe(true);
    });

    it(`accepts a seed without the optional ${optional.join(', ')}`, () => {
        const minimal = Object.fromEntries(Object.entries(valid).filter(([field]) => !optional.includes(field)));

        expect(guard(minimal)).toBe(true);
    });

    it.each([null, 'seed', 42])('rejects %p because it is not a record', (value) => {
        expect(guard(value)).toBe(false);
    });

    it.each(invalid)('rejects a seed with an invalid %s (%p)', (field, value) => {
        expect(guard({ ...valid, [field]: value })).toBe(false);
    });
});

describe('isSeedSampler mirostat modes', () => {
    it.each([MirostatEnum.DEFAULT, MirostatEnum.MIROSTAT1, MirostatEnum.MIROSTAT2])('accepts the mirostat mode %p', (mirostat) => {
        expect(isSeedSampler({ name: 'Creative', mirostat })).toBe(true);
    });
});

describe('parseSeedArray', () => {
    const isNamed = (value: unknown): value is { name: string; } => typeof (value as { name?: unknown; })?.name === 'string';

    it('returns the seeds when every entry is valid', () => {
        const seeds = [{ name: 'a' }, { name: 'b' }];

        expect(parseSeedArray(seeds, 'items', isNamed)).toEqual({ success: true, seeds });
    });

    it('fails when the data is not an array', () => {
        expect(parseSeedArray({ name: 'a' }, 'items', isNamed)).toEqual({
            success: false,
            error: 'Migration: seed items is invalid, expected an array of objects'
        });
    });

    it('fails with the index of the first invalid entry', () => {
        expect(parseSeedArray([{ name: 'a' }, { title: 'b' }, 'c'], 'items', isNamed)).toEqual({
            success: false,
            error: 'Migration: seed items entry 1 is invalid'
        });
    });
});
