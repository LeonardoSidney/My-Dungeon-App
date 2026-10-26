import { SamplerListItem } from '@domain/controllers';

const samplerAttributes = [
    { key: 'temperature', label: 'Temp' },
    { key: 'topP', label: 'Top P' },
    { key: 'topK', label: 'Top K' },
    { key: 'minP', label: 'Min P' },
    { key: 'repeatLastN', label: 'Repeat Last N' },
    { key: 'repeatPenalty', label: 'Repeat Penalty' },
    { key: 'frequencyPenalty', label: 'Freq Penalty' },
    { key: 'presencePenalty', label: 'Presence Penalty' },
    { key: 'mirostat', label: 'Mirostat' },
    { key: 'mirostatEnt', label: 'Mirostat Tau' },
    { key: 'mirostatLr', label: 'Mirostat Eta' },
    { key: 'seed', label: 'Seed' },
    { key: 'dryAllowedLenght', label: 'Dry Allowed Length' },
    { key: 'dryBase', label: 'Dry Base' },
    { key: 'dryMultiplier', label: 'Dry Multiplier' },
    { key: 'drySequenceBreakers', label: 'Dry Seq Breakers' },
    { key: 'dynaTempExp', label: 'Dyna Temp Exp' },
    { key: 'dynaTempRange', label: 'Dyna Temp Range' },
    { key: 'topNSigma', label: 'Top N Sigma' },
    { key: 'typicalP', label: 'Typical P' },
    { key: 'xtcProbability', label: 'XTC Probability' },
    { key: 'xtcThreshould', label: 'XTC Threshold' },
    { key: 'adaptativeDecay', label: 'Adaptative Decay' },
    { key: 'adaptativeTarget', label: 'Adaptative Target' },
    { key: 'ignoreEOS', label: 'Ignore EOS' },
] as const;

export function getSamplerDetailsText (sampler: SamplerListItem): string {
    const parts: string[] = [];

    const defaultLabel = sampler.systemDefault ? 'System Default' : 'Custom';
    parts.push(defaultLabel);

    samplerAttributes.forEach((attr) => {
        const value = sampler[attr.key];
        if (value !== undefined && value !== null) {
            parts.push(` | ${attr.label}: ${value}`);
        }
    });

    return parts.join('');
}
