import { SamplerListItem } from '@domain/controllers';
import { samplerAttributes } from './constants';

export function getSamplerDetailsText (sampler: SamplerListItem): string {
    const parts: string[] = [];

    const defaultLabel = sampler.systemDefault ? 'System Default' : 'Custom';
    parts.push(defaultLabel);

    samplerAttributes.forEach((attr) => {
        const value = sampler[attr.key as keyof SamplerListItem];
        if (value !== undefined && value !== null) {
            parts.push(` | ${attr.label}: ${value}`);
        }
    });

    return parts.join('');
}
