import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { CreateSamplerServiceParams, CreateSamplerServiceResponse, ICreateSamplerService, IIdGenerator } from '@domain/services';

export class CreateSamplerService implements ICreateSamplerService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    createSampler(params: CreateSamplerServiceParams): CreateSamplerServiceResponse {
        this.logger.info('Execute CreateSamplerService::createSampler');

        const createdAt = new Date();
        const sampler: Sampler = {
            id: this.idGenerator.generate(),
            name: params.name,
            observation: params.observation,
            systemDefault: false,
            adaptativeDecay: params.adaptativeDecay,
            adaptativeTarget: params.adaptativeTarget,
            dryAllowedLenght: params.dryAllowedLenght,
            dryBase: params.dryBase,
            dryMultiplier: params.dryMultiplier,
            drySequenceBreakers: params.drySequenceBreakers,
            dynaTempExp: params.dynaTempExp,
            dynaTempRange: params.dynaTempRange,
            frequencyPenalty: params.frequencyPenalty,
            ignoreEOS: params.ignoreEOS,
            minP: params.minP,
            mirostat: params.mirostat,
            mirostatEnt: params.mirostatEnt,
            mirostatLr: params.mirostatLr,
            presencePenalty: params.presencePenalty,
            repeatLastN: params.repeatLastN,
            repeatPenalty: params.repeatPenalty,
            seed: params.seed,
            temperature: params.temperature,
            topK: params.topK,
            topNSigma: params.topNSigma,
            topP: params.topP,
            typicalP: params.typicalP,
            xtcProbability: params.xtcProbability,
            xtcThreshould: params.xtcThreshould,
            createdAt: createdAt,
            updatedAt: createdAt
        };

        this.logger.debug('Sampler created with success', sampler);

        return {
            success: true,
            sampler
        };
    }
}
