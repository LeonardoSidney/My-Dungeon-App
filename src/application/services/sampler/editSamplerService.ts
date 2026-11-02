import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditSamplerServiceParams, EditSamplerServiceReturn, IEditSamplerService } from '@domain/services';

export class EditSamplerService implements IEditSamplerService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editSampler (params: EditSamplerServiceParams): EditSamplerServiceReturn {
        this.logger.info('Executing EditSamplerService::editSampler');
        const { sampler, editParams } = params;

        const editedSampler: Sampler = {
            ...sampler,
            name: editParams.name.trim(),
            observation: editParams.observation,
            adaptiveDecay: editParams.adaptiveDecay,
            adaptiveTarget: editParams.adaptiveTarget,
            dryAllowedLength: editParams.dryAllowedLength,
            dryBase: editParams.dryBase,
            dryMultiplier: editParams.dryMultiplier,
            drySequenceBreakers: editParams.drySequenceBreakers,
            dynaTempExp: editParams.dynaTempExp,
            dynaTempRange: editParams.dynaTempRange,
            ignoreEOS: editParams.ignoreEOS,
            minP: editParams.minP,
            mirostat: editParams.mirostat,
            mirostatEnt: editParams.mirostatEnt,
            mirostatLr: editParams.mirostatLr,
            frequencyPenalty: editParams.frequencyPenalty,
            presencePenalty: editParams.presencePenalty,
            repeatLastN: editParams.repeatLastN,
            repeatPenalty: editParams.repeatPenalty,
            seed: editParams.seed,
            temperature: editParams.temperature,
            topK: editParams.topK,
            topNSigma: editParams.topNSigma,
            topP: editParams.topP,
            typicalP: editParams.typicalP,
            xtcProbability: editParams.xtcProbability,
            xtcThreshold: editParams.xtcThreshold,
            updatedAt: new Date()
        };

        this.logger.debug('Sampler edited with success', editedSampler);

        return {
            success: true,
            sampler: editedSampler
        };
    }
}
