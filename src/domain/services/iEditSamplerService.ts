import { Sampler } from '../entities';

export interface IEditSamplerService {
    editSampler (request: EditSamplerServiceParams): EditSamplerServiceReturn;
}

export type EditSamplerServiceParams = {
    id: string;
    name: string;
    observation?: string;
    systemDefault?: boolean;
    adaptativeDecay?: number;
    adaptativeTarget?: number;
    dryAllowedLenght?: number;
    dryBase?: number;
    dryMultiplier?: number;
    drySequenceBreakers?: string;
    dynaTempExp?: number;
    dynaTempRange?: number;
    frequencyPenalty?: number;
    ignoreEOS?: boolean;
    minP?: number;
    mirostat?: number;
    mirostatEnt?: number;
    mirostatLr?: number;
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
    xtcThreshould?: number;
    createdAt: Date;
};

export type EditSamplerServiceReturn = {
    success: boolean;
    sampler?: Sampler;
    error?: string;
};
