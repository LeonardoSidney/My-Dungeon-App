export type Sampler = {
    id: string;
    name: string;
    observation?: string;
    systemDefault: boolean;
    adaptativeDecay?: number;
    adaptativeTarget?: number;
    dryAllowedLenght?: number;
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
    xtcThreshould?: number;
    createdAt: Date;
    updatedAt: Date;
};

export type SamplerParameters = Omit<Sampler, 'id' | 'name' | 'observation' | 'systemDefault' | 'createdAt' | 'updatedAt'>;

export enum MirostatEnum {
    DEFAULT,
    MIROSTAT1,
    MIROSTAT2
}
