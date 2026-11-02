import type { Sampler } from '@domain/entities';
import type { SamplerDetails } from '@domain/controllers';
import { IGetSamplerPresenter } from '@domain/presenters';

export class GetSamplerPresenter implements IGetSamplerPresenter {
    present (sampler: Sampler): SamplerDetails {
        return {
            id: sampler.id,
            name: sampler.name,
            observation: sampler.observation,
            adaptiveDecay: sampler.adaptiveDecay,
            adaptiveTarget: sampler.adaptiveTarget,
            dryAllowedLength: sampler.dryAllowedLength,
            dryBase: sampler.dryBase,
            dryMultiplier: sampler.dryMultiplier,
            drySequenceBreakers: sampler.drySequenceBreakers,
            dynaTempExp: sampler.dynaTempExp,
            dynaTempRange: sampler.dynaTempRange,
            ignoreEOS: sampler.ignoreEOS,
            minP: sampler.minP,
            mirostat: sampler.mirostat,
            mirostatEnt: sampler.mirostatEnt,
            mirostatLr: sampler.mirostatLr,
            frequencyPenalty: sampler.frequencyPenalty,
            presencePenalty: sampler.presencePenalty,
            repeatLastN: sampler.repeatLastN,
            repeatPenalty: sampler.repeatPenalty,
            seed: sampler.seed,
            temperature: sampler.temperature,
            topK: sampler.topK,
            topNSigma: sampler.topNSigma,
            topP: sampler.topP,
            typicalP: sampler.typicalP,
            xtcProbability: sampler.xtcProbability,
            xtcThreshold: sampler.xtcThreshold,
        };
    }
}
