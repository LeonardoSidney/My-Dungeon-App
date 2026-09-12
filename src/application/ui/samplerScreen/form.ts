import { Sampler } from '@domain/entities';
import {
    CreateSamplerControllerParams,
    EditSamplerControllerParams,
    ICreateSamplerController,
    IEditSamplerController,
} from '@domain/controllers';
import { SamplerFormData, FormErrors } from './constants';
import { ControllerResponse } from '@application/ui/hooks';

export function toSamplerFormState (sampler: Sampler): SamplerFormData {
    return {
        id: sampler.id,
        name: sampler.name,
        observation: sampler.observation ?? '',
        temperature: sampler.temperature?.toString() ?? '',
        topP: sampler.topP?.toString() ?? '',
        topK: sampler.topK?.toString() ?? '',
        minP: sampler.minP?.toString() ?? '',
        repeatLastN: sampler.repeatLastN?.toString() ?? '',
        repeatPenalty: sampler.repeatPenalty?.toString() ?? '',
        frequencyPenalty: sampler.frequencyPenalty?.toString() ?? '',
        presencePenalty: sampler.presencePenalty?.toString() ?? '',
        mirostat: sampler.mirostat,
        mirostatEnt: sampler.mirostatEnt?.toString() ?? '',
        mirostatLr: sampler.mirostatLr?.toString() ?? '',
        seed: sampler.seed ?? '',
        dryAllowedLenght: sampler.dryAllowedLenght?.toString() ?? '',
        dryBase: sampler.dryBase?.toString() ?? '',
        dryMultiplier: sampler.dryMultiplier?.toString() ?? '',
        drySequenceBreakers: sampler.drySequenceBreakers ?? '',
        dynaTempExp: sampler.dynaTempExp?.toString() ?? '',
        dynaTempRange: sampler.dynaTempRange?.toString() ?? '',
        topNSigma: sampler.topNSigma?.toString() ?? '',
        typicalP: sampler.typicalP?.toString() ?? '',
        xtcProbability: sampler.xtcProbability?.toString() ?? '',
        xtcThreshould: sampler.xtcThreshould?.toString() ?? '',
        adaptativeDecay: sampler.adaptativeDecay?.toString() ?? '',
        adaptativeTarget: sampler.adaptativeTarget?.toString() ?? '',
        ignoreEOS: sampler.ignoreEOS ? 'true' : '',
    };
}

export function initialSamplerForm (): SamplerFormData {
    return {
        id: '',
        name: '',
        observation: '',
        temperature: '',
        topP: '',
        topK: '',
        minP: '',
        repeatLastN: '',
        repeatPenalty: '',
        frequencyPenalty: '',
        presencePenalty: '',
        mirostat: undefined,
        mirostatEnt: '',
        mirostatLr: '',
        seed: '',
        dryAllowedLenght: '',
        dryBase: '',
        dryMultiplier: '',
        drySequenceBreakers: '',
        dynaTempExp: '',
        dynaTempRange: '',
        topNSigma: '',
        typicalP: '',
        xtcProbability: '',
        xtcThreshould: '',
        adaptativeDecay: '',
        adaptativeTarget: '',
        ignoreEOS: '',
    };
}

function toOptionalFloat (value: string): number | undefined {
    if (!value) {
        return undefined;
    }
    return parseFloat(value);
}

function toOptionalInt (value: string): number | undefined {
    if (!value) {
        return undefined;
    }
    return parseInt(value, 10);
}

function toIgnoreEOS (value: string): boolean | undefined {
    if (value === '') {
        return undefined;
    }
    if (value === 'true') {
        return true;
    }
    return false;
}

export function toCreateParams (form: SamplerFormData): CreateSamplerControllerParams {
    return {
        name: form.name.trim(),
        observation: form.observation.trim() || undefined,
        temperature: toOptionalFloat(form.temperature),
        topP: toOptionalFloat(form.topP),
        topK: toOptionalInt(form.topK),
        minP: toOptionalFloat(form.minP),
        repeatLastN: toOptionalInt(form.repeatLastN),
        repeatPenalty: toOptionalFloat(form.repeatPenalty),
        frequencyPenalty: toOptionalFloat(form.frequencyPenalty),
        presencePenalty: toOptionalFloat(form.presencePenalty),
        mirostat: form.mirostat,
        mirostatEnt: toOptionalFloat(form.mirostatEnt),
        mirostatLr: toOptionalFloat(form.mirostatLr),
        seed: form.seed.trim() || undefined,
        dryAllowedLenght: toOptionalInt(form.dryAllowedLenght),
        dryBase: toOptionalFloat(form.dryBase),
        dryMultiplier: toOptionalFloat(form.dryMultiplier),
        drySequenceBreakers: form.drySequenceBreakers.trim() || undefined,
        dynaTempExp: toOptionalFloat(form.dynaTempExp),
        dynaTempRange: toOptionalInt(form.dynaTempRange),
        topNSigma: toOptionalFloat(form.topNSigma),
        typicalP: toOptionalFloat(form.typicalP),
        xtcProbability: toOptionalFloat(form.xtcProbability),
        xtcThreshould: toOptionalFloat(form.xtcThreshould),
        adaptativeDecay: toOptionalFloat(form.adaptativeDecay),
        adaptativeTarget: toOptionalFloat(form.adaptativeTarget),
        ignoreEOS: toIgnoreEOS(form.ignoreEOS),
    };
}

export function toEditParams (form: SamplerFormData): EditSamplerControllerParams {
    return {
        id: form.id,
        editParams: {
            name: form.name,
            observation: form.observation || undefined,
            systemDefault: false,
            temperature: toOptionalFloat(form.temperature),
            topP: toOptionalFloat(form.topP),
            topK: toOptionalInt(form.topK),
            minP: toOptionalFloat(form.minP),
            repeatLastN: toOptionalInt(form.repeatLastN),
            repeatPenalty: toOptionalFloat(form.repeatPenalty),
            frequencyPenalty: toOptionalFloat(form.frequencyPenalty),
            presencePenalty: toOptionalFloat(form.presencePenalty),
            mirostat: form.mirostat,
            mirostatEnt: toOptionalFloat(form.mirostatEnt),
            mirostatLr: toOptionalFloat(form.mirostatLr),
            seed: form.seed.trim() || undefined,
            dryAllowedLenght: toOptionalInt(form.dryAllowedLenght),
            dryBase: toOptionalFloat(form.dryBase),
            dryMultiplier: toOptionalFloat(form.dryMultiplier),
            drySequenceBreakers: form.drySequenceBreakers.trim() || undefined,
            dynaTempExp: toOptionalFloat(form.dynaTempExp),
            dynaTempRange: toOptionalInt(form.dynaTempRange),
            topNSigma: toOptionalFloat(form.topNSigma),
            typicalP: toOptionalFloat(form.typicalP),
            xtcProbability: toOptionalFloat(form.xtcProbability),
            xtcThreshould: toOptionalFloat(form.xtcThreshould),
            adaptativeDecay: toOptionalFloat(form.adaptativeDecay),
            adaptativeTarget: toOptionalFloat(form.adaptativeTarget),
            ignoreEOS: toIgnoreEOS(form.ignoreEOS),
        },
    };
}

export function validateSamplerForm (form: SamplerFormData): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    return errors;
}

export function submitSampler (
    form: SamplerFormData,
    createSampler: ICreateSamplerController,
    editSampler: IEditSamplerController
): Promise<ControllerResponse> {
    if (form.id) {
        return editSampler.handle(toEditParams(form));
    }
    return createSampler.handle(toCreateParams(form));
}
