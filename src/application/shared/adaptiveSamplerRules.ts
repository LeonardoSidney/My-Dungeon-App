import { MAX_ADAPTIVE_DECAY, MAX_ADAPTIVE_TARGET, SamplerActionEnum } from '@domain/constants/sampler';
import { SamplerParameters } from '@domain/entities';

function isOutOfRange (value: number | undefined, max: number): boolean {
    return value !== undefined && (value <= 0 || value > max);
}

export function getAdaptiveRangeError (parameters: SamplerParameters, action: SamplerActionEnum): string | null {
    if (isOutOfRange(parameters.adaptiveTarget, MAX_ADAPTIVE_TARGET)) {
        return `Adaptive target must be greater than 0 and up to ${MAX_ADAPTIVE_TARGET} to ${action} a sampler`;
    }

    if (isOutOfRange(parameters.adaptiveDecay, MAX_ADAPTIVE_DECAY)) {
        return `Adaptive decay must be greater than 0 and up to ${MAX_ADAPTIVE_DECAY} to ${action} a sampler`;
    }

    return null;
}
