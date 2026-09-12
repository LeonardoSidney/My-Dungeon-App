import { Sampler, MirostatEnum } from '@domain/entities';

export type FormErrors = {
    name?: string;
};

export interface SamplerPanelProps {
    samplers: Sampler[];
    isLoading?: boolean;
    onEdit: (sampler: Sampler) => void;
    onDelete: (sampler: Sampler) => Promise<void>;
}

export type SamplerFormData = {
    id: string;
    name: string;
    observation: string;
    temperature: string;
    topP: string;
    topK: string;
    minP: string;
    repeatLastN: string;
    repeatPenalty: string;
    frequencyPenalty: string;
    presencePenalty: string;
    mirostat: MirostatEnum | undefined;
    mirostatEnt: string;
    mirostatLr: string;
    seed: string;
    dryAllowedLenght: string;
    dryBase: string;
    dryMultiplier: string;
    drySequenceBreakers: string;
    dynaTempExp: string;
    dynaTempRange: string;
    topNSigma: string;
    typicalP: string;
    xtcProbability: string;
    xtcThreshould: string;
    adaptativeDecay: string;
    adaptativeTarget: string;
    ignoreEOS: string;
};
