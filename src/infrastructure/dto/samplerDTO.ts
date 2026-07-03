import { MirostatEnum, Sampler } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class SamplerDTO {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly observation: string | undefined,
        private readonly systemDefault: boolean,
        private readonly adaptativeDecay: number | undefined,
        private readonly adaptativeTarget: number | undefined,
        private readonly dryAllowedLenght: number | undefined,
        private readonly dryBase: number | undefined,
        private readonly dryMultiplier: number | undefined,
        private readonly drySequenceBreakers: string | undefined,
        private readonly dynaTempExp: number | undefined,
        private readonly dynaTempRange: number | undefined,
        private readonly ignoreEOS: boolean | undefined,
        private readonly minP: number | undefined,
        private readonly mirostat: MirostatEnum | undefined,
        private readonly mirostatEnt: number | undefined,
        private readonly mirostatLr: number | undefined,
        private readonly frequencyPenalty: number | undefined,
        private readonly presencePenalty: number | undefined,
        private readonly repeatLastN: number | undefined,
        private readonly repeatPenalty: number | undefined,
        private readonly seed: string | undefined,
        private readonly temperature: number | undefined,
        private readonly topK: number | undefined,
        private readonly topNSigma: number | undefined,
        private readonly topP: number | undefined,
        private readonly typicalP: number | undefined,
        private readonly xtcProbability: number | undefined,
        private readonly xtcThreshould: number | undefined,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity(): Sampler {
        return {
            id: this.id,
            name: this.name,
            observation: this.observation,
            systemDefault: this.systemDefault,
            adaptativeDecay: this.adaptativeDecay,
            adaptativeTarget: this.adaptativeTarget,
            dryAllowedLenght: this.dryAllowedLenght,
            dryBase: this.dryBase,
            dryMultiplier: this.dryMultiplier,
            drySequenceBreakers: this.drySequenceBreakers,
            dynaTempExp: this.dynaTempExp,
            dynaTempRange: this.dynaTempRange,
            ignoreEOS: this.ignoreEOS,
            minP: this.minP,
            mirostat: this.mirostat,
            mirostatEnt: this.mirostatEnt,
            mirostatLr: this.mirostatLr,
            frequencyPenalty: this.frequencyPenalty,
            presencePenalty: this.presencePenalty,
            repeatLastN: this.repeatLastN,
            repeatPenalty: this.repeatPenalty,
            seed: this.seed,
            temperature: this.temperature,
            topK: this.topK,
            topNSigma: this.topNSigma,
            topP: this.topP,
            typicalP: this.typicalP,
            xtcProbability: this.xtcProbability,
            xtcThreshould: this.xtcThreshould,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage(data: unknown): SamplerDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            typeof data.systemDefault !== 'boolean' ||
            (data.drySequenceBreakers !== undefined && typeof data.drySequenceBreakers !== 'string') ||
            (data.adaptativeDecay !== undefined && typeof data.adaptativeDecay !== 'number') ||
            (data.adaptativeTarget !== undefined && typeof data.adaptativeTarget !== 'number') ||
            (data.dryAllowedLenght !== undefined && typeof data.dryAllowedLenght !== 'number') ||
            (data.dryBase !== undefined && typeof data.dryBase !== 'number') ||
            (data.dryMultiplier !== undefined && typeof data.dryMultiplier !== 'number') ||
            (data.dynaTempExp !== undefined && typeof data.dynaTempExp !== 'number') ||
            (data.dynaTempRange !== undefined && typeof data.dynaTempRange !== 'number') ||
            (data.ignoreEOS !== undefined && typeof data.ignoreEOS !== 'boolean') ||
            (data.minP !== undefined && typeof data.minP !== 'number') ||
            (data.mirostat !== undefined && typeof data.mirostat !== 'number') ||
            (data.mirostatEnt !== undefined && typeof data.mirostatEnt !== 'number') ||
            (data.mirostatLr !== undefined && typeof data.mirostatLr !== 'number') ||
            (data.frequencyPenalty !== undefined && typeof data.frequencyPenalty !== 'number') ||
            (data.presencePenalty !== undefined && typeof data.presencePenalty !== 'number') ||
            (data.repeatLastN !== undefined && typeof data.repeatLastN !== 'number') ||
            (data.repeatPenalty !== undefined && typeof data.repeatPenalty !== 'number') ||
            (data.seed !== undefined && typeof data.seed !== 'string') ||
            (data.temperature !== undefined && typeof data.temperature !== 'number') ||
            (data.topK !== undefined && typeof data.topK !== 'number') ||
            (data.topNSigma !== undefined && typeof data.topNSigma !== 'number') ||
            (data.topP !== undefined && typeof data.topP !== 'number') ||
            (data.typicalP !== undefined && typeof data.typicalP !== 'number') ||
            (data.xtcProbability !== undefined && typeof data.xtcProbability !== 'number') ||
            (data.xtcThreshould !== undefined && typeof data.xtcThreshould !== 'number') ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new SamplerDTO(
            data.id,
            data.name,
            data.observation,
            data.systemDefault,
            data.adaptativeDecay,
            data.adaptativeTarget,
            data.dryAllowedLenght,
            data.dryBase,
            data.dryMultiplier,
            data.drySequenceBreakers,
            data.dynaTempExp,
            data.dynaTempRange,
            data.ignoreEOS,
            data.minP,
            data.mirostat,
            data.mirostatEnt,
            data.mirostatLr,
            data.frequencyPenalty,
            data.presencePenalty,
            data.repeatLastN,
            data.repeatPenalty,
            data.seed,
            data.temperature,
            data.topK,
            data.topNSigma,
            data.topP,
            data.typicalP,
            data.xtcProbability,
            data.xtcThreshould,
            createdAt,
            updatedAt
        );
    }
}
