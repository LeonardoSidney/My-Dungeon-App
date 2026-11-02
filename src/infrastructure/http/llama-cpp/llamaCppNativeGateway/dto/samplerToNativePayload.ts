import { Sampler } from '@domain/entities';

export type NativePayload = {
    model: string;
    prompt: string;
    temperature?: number;
    dynatemp_range?: number;
    dynatemp_exponent?: number;
    top_k?: number;
    top_p?: number;
    min_p?: number;
    top_n_sigma?: number;
    adaptive_target?: number;
    adaptive_decay?: number;
    n_predict?: number;
    n_keep?: number;
    n_indent?: number;
    stream: boolean;
    stop?: string[];
    typical_p?: number;
    repeat_penalty?: number;
    repeat_last_n?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    dry_multiplier?: number;
    dry_base?: number;
    dry_allowed_length?: number;
    dry_penalty_last_n?: number;
    dry_sequence_breakers?: string[];
    xtc_probability?: number;
    xtc_threshold?: number;
    mirostat?: number;
    mirostat_tau?: number;
    mirostat_eta?: number;
    grammar?: string;
    json_schema?: object;
    seed?: number;
    ignore_eos?: boolean;
    logit_bias?: number[];
    n_probs?: number;
    min_keep?: number;
    t_max_predict_ms?: number;
    id_slot?: number;
    cache_prompt?: boolean;
    return_tokens?: boolean;
    samplers?: string[];
    timings_per_token?: boolean;
    return_progress?: boolean;
    sse_ping_interval?: number;
    post_sampling_probs?: boolean;
    response_fields?: string[];
    lora?: { id: number; scale: number }[];
    n_cmpl?: number;
    n_cache_reuse?: number;
};

const ADAPTIVE_SAMPLER_CHAIN = [
    'penalties',
    'dry',
    'top_n_sigma',
    'top_k',
    'typ_p',
    'top_p',
    'min_p',
    'xtc',
    'temperature',
    'adaptive_p',
];

export function mapSamplerToNativePayload (
    sampler: Sampler,
    modelId: string,
    prompt: string
): NativePayload {
    const temperature = sampler.temperature ?? 0.8;
    const topK = sampler.topK ?? 40;
    const topP = sampler.topP ?? 0.95;
    const minP = sampler.minP ?? 0.05;
    const typicalP = sampler.typicalP;
    const repeatPenalty = sampler.repeatPenalty;
    const repeatLastN = sampler.repeatLastN;
    const presencePenalty = sampler.presencePenalty;
    const frequencyPenalty = sampler.frequencyPenalty;
    const dryMultiplier = sampler.dryMultiplier;
    const dryBase = sampler.dryBase;
    const dryAllowedLength = sampler.dryAllowedLength;
    const drySequenceBreakers = sampler.drySequenceBreakers;
    const xtcProbability = sampler.xtcProbability;
    const xtcThreshold = sampler.xtcThreshold;
    const mirostat = sampler.mirostat;
    const mirostatTau = sampler.mirostatEnt;
    const mirostatEta = sampler.mirostatLr;
    const seed = sampler.seed ? parseInt(sampler.seed, 10) : -1;
    const ignoreEos = sampler.ignoreEOS;
    const dynaTempRange = sampler.dynaTempRange;
    const dynaTempExponent = sampler.dynaTempExp;
    const topNSigma = sampler.topNSigma;
    const adaptiveTarget = sampler.adaptiveTarget;
    const adaptiveDecay = sampler.adaptiveDecay;

    const body: NativePayload = {
        model: modelId,
        prompt,
        temperature,
        top_k: topK,
        top_p: topP,
        min_p: minP,
        stream: true,
    };

    if (dynaTempRange !== undefined) {
        body.dynatemp_range = dynaTempRange;
    }

    if (dynaTempExponent !== undefined) {
        body.dynatemp_exponent = dynaTempExponent;
    }

    if (topNSigma !== undefined) {
        body.top_n_sigma = topNSigma;
    }

    if (adaptiveTarget !== undefined) {
        body.adaptive_target = adaptiveTarget;
        body.samplers = [...ADAPTIVE_SAMPLER_CHAIN];
    }

    if (adaptiveDecay !== undefined) {
        body.adaptive_decay = adaptiveDecay;
    }

    if (typicalP !== undefined) {
        body.typical_p = typicalP;
    }

    if (repeatPenalty !== undefined) {
        body.repeat_penalty = repeatPenalty;
    }

    if (repeatLastN !== undefined) {
        body.repeat_last_n = repeatLastN;
    }

    if (presencePenalty !== undefined) {
        body.presence_penalty = presencePenalty;
    }

    if (frequencyPenalty !== undefined) {
        body.frequency_penalty = frequencyPenalty;
    }

    if (dryMultiplier !== undefined) {
        body.dry_multiplier = dryMultiplier;
    }

    if (dryBase !== undefined) {
        body.dry_base = dryBase;
    }

    if (dryAllowedLength !== undefined) {
        body.dry_allowed_length = dryAllowedLength;
    }

    if (drySequenceBreakers !== undefined) {
        body.dry_sequence_breakers = drySequenceBreakers.split(/(?=[\n"':*[\]])/).filter(Boolean);
    }

    if (xtcProbability !== undefined) {
        body.xtc_probability = xtcProbability;
    }

    if (xtcThreshold !== undefined) {
        body.xtc_threshold = xtcThreshold;
    }

    if (mirostat !== undefined) {
        body.mirostat = mirostat;
        if (mirostatTau !== undefined) {
            body.mirostat_tau = mirostatTau;
        }
        if (mirostatEta !== undefined) {
            body.mirostat_eta = mirostatEta;
        }
    }

    body.seed = seed;

    if (ignoreEos !== undefined) {
        body.ignore_eos = ignoreEos;
    }

    return body;
}
