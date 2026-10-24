import type { Sampler } from '@domain/entities';
import type { SamplerListItem } from '@domain/controllers';
import { IGetSamplersPresenter } from '@domain/presenters';

export class GetSamplersPresenter implements IGetSamplersPresenter {
    present (samplers: Sampler[]): SamplerListItem[] {
        return samplers.map(sampler => ({
            id: sampler.id,
            name: sampler.name,
            observation: sampler.observation,
            adaptativeDecay: sampler.adaptativeDecay,
            adaptativeTarget: sampler.adaptativeTarget,
            dryAllowedLenght: sampler.dryAllowedLenght,
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
            xtcThreshould: sampler.xtcThreshould,
            systemDefault: sampler.systemDefault,
        }));
    }
}
