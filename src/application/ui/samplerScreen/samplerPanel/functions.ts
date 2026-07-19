import { Sampler } from '@domain/entities';
import { samplerAttributes } from './constants';

export function getSamplerDetailsText (sampler: Sampler): string {
    const parts: string[] = [];

    if (sampler.systemDefault) {
        parts.push('System Default');
    } else {
        parts.push('Custom');
    }

    samplerAttributes.forEach((attr) => {
        const value = sampler[attr.key as keyof Sampler];
        if (value !== undefined && value !== null) {
            parts.push(` | ${attr.label}: ${value}`);
        }
    });

    return parts.join('');
}
