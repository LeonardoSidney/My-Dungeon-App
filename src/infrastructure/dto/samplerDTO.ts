import { MirostatEnum, Sampler } from "../../domain/entities/Sampler";
import { isRecord, isStringArray, parseDate } from "./shared";

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
        private readonly drySequenceBreakers: string[] | undefined,
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

        const numericFields = [
            "adaptativeDecay",
            "adaptativeTarget",
            "dryAllowedLenght",
            "dryBase",
            "dryMultiplier",
            "dynaTempExp",
            "dynaTempRange",
            "minP",
            "mirostatEnt",
            "mirostatLr",
            "frequencyPenalty",
            "presencePenalty",
            "repeatLastN",
            "repeatPenalty",
            "temperature",
            "topK",
            "topNSigma",
            "topP",
            "typicalP",
            "xtcProbability",
            "xtcThreshould"
        ] as const;

        for (const field of numericFields) {
            if (data[field] !== undefined && typeof data[field] !== "number") {
                return null;
            }
        }

        if (
            typeof data.id !== "string" ||
            typeof data.name !== "string" ||
            (data.observation !== undefined && typeof data.observation !== "string") ||
            typeof data.systemDefault !== "boolean" ||
            (data.drySequenceBreakers !== undefined && !isStringArray(data.drySequenceBreakers)) ||
            (data.ignoreEOS !== undefined && typeof data.ignoreEOS !== "boolean") ||
            (data.mirostat !== undefined && typeof data.mirostat !== "number") ||
            (data.seed !== undefined && typeof data.seed !== "string") ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new SamplerDTO(
            data.id,
            data.name,
            data.observation as string | undefined,
            data.systemDefault,
            data.adaptativeDecay as number | undefined,
            data.adaptativeTarget as number | undefined,
            data.dryAllowedLenght as number | undefined,
            data.dryBase as number | undefined,
            data.dryMultiplier as number | undefined,
            data.drySequenceBreakers as string[] | undefined,
            data.dynaTempExp as number | undefined,
            data.dynaTempRange as number | undefined,
            data.ignoreEOS as boolean | undefined,
            data.minP as number | undefined,
            data.mirostat as MirostatEnum | undefined,
            data.mirostatEnt as number | undefined,
            data.mirostatLr as number | undefined,
            data.frequencyPenalty as number | undefined,
            data.presencePenalty as number | undefined,
            data.repeatLastN as number | undefined,
            data.repeatPenalty as number | undefined,
            data.seed as string | undefined,
            data.temperature as number | undefined,
            data.topK as number | undefined,
            data.topNSigma as number | undefined,
            data.topP as number | undefined,
            data.typicalP as number | undefined,
            data.xtcProbability as number | undefined,
            data.xtcThreshould as number | undefined,
            createdAt,
            updatedAt
        );
    }
}
