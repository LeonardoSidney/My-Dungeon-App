import { getAdaptiveRangeError } from '@application/shared/adaptiveSamplerRules';
import { SamplerActionEnum } from '@domain/constants/sampler';

const TARGET_ERROR = 'Adaptive target must be greater than 0 and up to 1 to edit a sampler';
const DECAY_ERROR = 'Adaptive decay must be greater than 0 and up to 0.99 to edit a sampler';

describe('getAdaptiveRangeError', () => {
    it('accepts a sampler without adaptive parameters', () => {
        expect(getAdaptiveRangeError({}, SamplerActionEnum.EDIT)).toBeNull();
    });

    it('accepts values inside the range', () => {
        expect(getAdaptiveRangeError({ adaptiveTarget: 0.5, adaptiveDecay: 0.9 }, SamplerActionEnum.EDIT)).toBeNull();
    });

    it('accepts the upper limit', () => {
        expect(getAdaptiveRangeError({ adaptiveTarget: 1, adaptiveDecay: 0.99 }, SamplerActionEnum.EDIT)).toBeNull();
    });

    it('rejects a target of zero', () => {
        expect(getAdaptiveRangeError({ adaptiveTarget: 0 }, SamplerActionEnum.EDIT)).toBe(TARGET_ERROR);
    });

    it('rejects a negative target', () => {
        expect(getAdaptiveRangeError({ adaptiveTarget: -0.5 }, SamplerActionEnum.EDIT)).toBe(TARGET_ERROR);
    });

    it('rejects a target above the upper limit', () => {
        expect(getAdaptiveRangeError({ adaptiveTarget: 1.5 }, SamplerActionEnum.EDIT)).toBe(TARGET_ERROR);
    });

    it('rejects a decay of zero', () => {
        expect(getAdaptiveRangeError({ adaptiveDecay: 0 }, SamplerActionEnum.EDIT)).toBe(DECAY_ERROR);
    });

    it('rejects a negative decay', () => {
        expect(getAdaptiveRangeError({ adaptiveDecay: -0.5 }, SamplerActionEnum.EDIT)).toBe(DECAY_ERROR);
    });

    it('rejects a decay above the upper limit', () => {
        expect(getAdaptiveRangeError({ adaptiveDecay: 1 }, SamplerActionEnum.EDIT)).toBe(DECAY_ERROR);
    });

    it('names the create action in the message', () => {
        expect(getAdaptiveRangeError({ adaptiveTarget: 2 }, SamplerActionEnum.CREATE))
            .toBe('Adaptive target must be greater than 0 and up to 1 to create a sampler');
    });
});
