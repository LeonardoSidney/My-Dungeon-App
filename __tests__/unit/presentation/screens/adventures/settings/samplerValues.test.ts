import {
    describeSamplerValue,
    getChangedSamplerKeys,
    hasAdvancedChanges,
    isSamplerFieldVisible,
    samplerFieldSpecs,
    samplerValueKeys,
    setSamplerValue,
    toSamplerParameters,
    validateSamplerValues,
} from '@presentation/screens/adventures/settings/samplerValues';

describe('samplerFieldGroups', () => {
    it('lists every sampler parameter exactly once', () => {
        expect([...samplerValueKeys].sort()).toEqual(Object.keys(samplerFieldSpecs).sort());
        expect(new Set(samplerValueKeys).size).toBe(samplerValueKeys.length);
    });
});

describe('setSamplerValue', () => {
    it('keeps the overrides in the field order whatever order they are typed', () => {
        const overrides = setSamplerValue({ topK: '40' }, 'temperature', '0.9');

        expect(JSON.stringify(overrides)).toBe(JSON.stringify({ temperature: '0.9', topK: '40' }));
    });

    it('removes the override when the field is cleared', () => {
        expect(setSamplerValue({ temperature: '0.9', topK: '40' }, 'temperature', ' ')).toEqual({ topK: '40' });
    });
});

describe('validateSamplerValues', () => {
    it('accepts values that match the kind of each field', () => {
        expect(validateSamplerValues({
            temperature: '0.9',
            topK: '40',
            seed: '-1',
            mirostat: '2',
            ignoreEOS: 'true',
            drySequenceBreakers: '\\n, "',
        })).toBeUndefined();
    });

    it('rejects decimals in whole number fields and text in number fields', () => {
        expect(validateSamplerValues({ topK: '4.5', temperature: 'hot', mirostat: '3' })).toEqual({
            topK: 'Must be a whole number',
            temperature: 'Must be a number',
            mirostat: 'Pick one of the options',
        });
    });
});

describe('describeSamplerValue', () => {
    it('shows the value, the choice label or the default', () => {
        expect(describeSamplerValue('temperature', '0.8')).toBe('0.8');
        expect(describeSamplerValue('ignoreEOS', 'true')).toBe('Yes');
        expect(describeSamplerValue('mirostat', '0')).toBe('Off');
        expect(describeSamplerValue('topK', undefined)).toBe('default');
    });
});

describe('isSamplerFieldVisible', () => {
    it('shows the mirostat tuning only while mirostat is on', () => {
        expect(isSamplerFieldVisible('mirostatEnt', {})).toBe(false);
        expect(isSamplerFieldVisible('mirostatEnt', { mirostat: '2' })).toBe(true);
        expect(isSamplerFieldVisible('temperature', {})).toBe(true);
    });
});

describe('getChangedSamplerKeys', () => {
    it('lists the values that differ from the saved ones, including cleared ones', () => {
        expect(getChangedSamplerKeys({ temperature: '1', minP: '0.1' }, { temperature: '1', topK: '40' })).toEqual(['topK', 'minP']);
    });
});

describe('hasAdvancedChanges', () => {
    it('tells when a changed value sits outside the core group', () => {
        expect(hasAdvancedChanges({ temperature: '1' }, {})).toBe(false);
        expect(hasAdvancedChanges({ xtcProbability: '0.1' }, {})).toBe(true);
    });
});

describe('toSamplerParameters', () => {
    it('sends every parameter, leaving the cleared ones undefined so the sampler drops them', () => {
        const parameters = toSamplerParameters({ temperature: '1.1', seed: '7' });

        expect(parameters.temperature).toBe(1.1);
        expect(parameters.seed).toBe('7');
        expect(Object.keys(parameters)).toHaveLength(samplerValueKeys.length);
        expect(parameters.topK).toBeUndefined();
    });
});
