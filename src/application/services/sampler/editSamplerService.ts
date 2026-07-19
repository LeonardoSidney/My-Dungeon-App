import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditSamplerServiceParams, EditSamplerServiceReturn, IEditSamplerService } from '@domain/services';

export class EditSamplerService implements IEditSamplerService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editSampler (params: EditSamplerServiceParams): EditSamplerServiceReturn {
        this.logger.info('Executing EditSamplerService::editSampler');
        const { id, name, observation, adaptativeDecay, adaptativeTarget, dryAllowedLenght, dryBase, dryMultiplier, drySequenceBreakers, dynaTempExp, dynaTempRange, frequencyPenalty, ignoreEOS, minP, mirostat, mirostatEnt, mirostatLr, presencePenalty, repeatLastN, repeatPenalty, seed, temperature, topK, topNSigma, topP, typicalP, xtcProbability, xtcThreshould, createdAt } = params;

        const sampler: Sampler = {
            id,
            name,
            observation,
            systemDefault: false,
            adaptativeDecay,
            adaptativeTarget,
            dryAllowedLenght,
            dryBase,
            dryMultiplier,
            drySequenceBreakers,
            dynaTempExp,
            dynaTempRange,
            frequencyPenalty,
            ignoreEOS,
            minP,
            mirostat,
            mirostatEnt,
            mirostatLr,
            presencePenalty,
            repeatLastN,
            repeatPenalty,
            seed,
            temperature,
            topK,
            topNSigma,
            topP,
            typicalP,
            xtcProbability,
            xtcThreshould,
            createdAt: createdAt,
            updatedAt: new Date()
        };

        this.logger.debug('Sampler edited with success', sampler);

        return {
            success: true,
            sampler
        };
    }
}
