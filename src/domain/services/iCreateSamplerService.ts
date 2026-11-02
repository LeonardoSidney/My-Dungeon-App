import { MirostatEnum, Sampler } from '../entities';

export interface ICreateSamplerService {
    createSampler(params: CreateSamplerServiceParams): CreateSamplerServiceResponse;
}

export type CreateSamplerServiceParams = {
    name: string;
    observation?: string;
    adaptiveDecay?: number;
    adaptiveTarget?: number;
    dryAllowedLength?: number;
    dryBase?: number;
    dryMultiplier?: number;
    drySequenceBreakers?: string;
    dynaTempExp?: number;
    dynaTempRange?: number;
    ignoreEOS?: boolean;
    minP?: number;
    mirostat?: MirostatEnum;
    mirostatEnt?: number;
    mirostatLr?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    repeatLastN?: number;
    repeatPenalty?: number;
    seed?: string;
    temperature?: number;
    topK?: number;
    topNSigma?: number;
    topP?: number;
    typicalP?: number;
    xtcProbability?: number;
    xtcThreshold?: number;
};

export type CreateSamplerServiceResponse = {
    success: boolean;
    sampler?: Sampler;
    error?: string;
};
