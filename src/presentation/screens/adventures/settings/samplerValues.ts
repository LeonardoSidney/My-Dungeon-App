import { MirostatEnum, SamplerParameters } from '@domain/entities';

export type SamplerValueKey = keyof SamplerParameters;

export type SamplerValues = Partial<Record<SamplerValueKey, string>>;

export enum SamplerFieldKindEnum {
    DECIMAL = 'decimal',
    INTEGER = 'integer',
    SEED = 'seed',
    TEXT = 'text',
    BOOLEAN = 'boolean',
    MIROSTAT = 'mirostat',
}

export type SamplerFieldKind =
    | SamplerFieldKindEnum.DECIMAL
    | SamplerFieldKindEnum.INTEGER
    | SamplerFieldKindEnum.SEED
    | SamplerFieldKindEnum.TEXT
    | SamplerFieldKindEnum.BOOLEAN
    | SamplerFieldKindEnum.MIROSTAT;

export enum BooleanChoiceEnum {
    NO = 'false',
    YES = 'true',
}

export type SamplerChoice = {
    value: string;
    label: string;
};

export type SamplerFieldSpec = {
    label: string;
    kind: SamplerFieldKind;
    choices?: SamplerChoice[];
    defaultChoice?: string;
};

export type SamplerFieldGroup = {
    id: string;
    title: string;
    isAdvanced: boolean;
    keys: SamplerValueKey[];
};

const NOT_A_NUMBER = 'Must be a number';
const NOT_A_WHOLE_NUMBER = 'Must be a whole number';
const UNKNOWN_CHOICE = 'Pick one of the options';
const MIROSTAT_DISABLED = String(MirostatEnum.DEFAULT);

export const samplerFieldSpecs: Record<SamplerValueKey, SamplerFieldSpec> = {
    temperature: { label: 'Temperature', kind: SamplerFieldKindEnum.DECIMAL },
    topP: { label: 'Top P', kind: SamplerFieldKindEnum.DECIMAL },
    topK: { label: 'Top K', kind: SamplerFieldKindEnum.INTEGER },
    minP: { label: 'Min P', kind: SamplerFieldKindEnum.DECIMAL },
    repeatLastN: { label: 'Repeat Last N', kind: SamplerFieldKindEnum.INTEGER },
    repeatPenalty: { label: 'Repeat Penalty', kind: SamplerFieldKindEnum.DECIMAL },
    frequencyPenalty: { label: 'Frequency Penalty', kind: SamplerFieldKindEnum.DECIMAL },
    presencePenalty: { label: 'Presence Penalty', kind: SamplerFieldKindEnum.DECIMAL },
    seed: { label: 'Seed', kind: SamplerFieldKindEnum.SEED },
    mirostat: {
        label: 'Mode',
        kind: SamplerFieldKindEnum.MIROSTAT,
        choices: [
            { value: String(MirostatEnum.DEFAULT), label: 'Off' },
            { value: String(MirostatEnum.MIROSTAT1), label: 'v1' },
            { value: String(MirostatEnum.MIROSTAT2), label: 'v2' },
        ],
        defaultChoice: MIROSTAT_DISABLED,
    },
    mirostatEnt: { label: 'Tau (target entropy)', kind: SamplerFieldKindEnum.DECIMAL },
    mirostatLr: { label: 'Eta (learning rate)', kind: SamplerFieldKindEnum.DECIMAL },
    dryMultiplier: { label: 'Multiplier', kind: SamplerFieldKindEnum.DECIMAL },
    dryBase: { label: 'Base', kind: SamplerFieldKindEnum.DECIMAL },
    dryAllowedLenght: { label: 'Allowed Length', kind: SamplerFieldKindEnum.INTEGER },
    drySequenceBreakers: { label: 'Sequence Breakers', kind: SamplerFieldKindEnum.TEXT },
    dynaTempRange: { label: 'Range', kind: SamplerFieldKindEnum.DECIMAL },
    dynaTempExp: { label: 'Exponent', kind: SamplerFieldKindEnum.DECIMAL },
    xtcProbability: { label: 'Probability', kind: SamplerFieldKindEnum.DECIMAL },
    xtcThreshould: { label: 'Threshold', kind: SamplerFieldKindEnum.DECIMAL },
    topNSigma: { label: 'Top N Sigma', kind: SamplerFieldKindEnum.DECIMAL },
    typicalP: { label: 'Typical P', kind: SamplerFieldKindEnum.DECIMAL },
    adaptativeDecay: { label: 'Adaptative Decay', kind: SamplerFieldKindEnum.DECIMAL },
    adaptativeTarget: { label: 'Adaptative Target', kind: SamplerFieldKindEnum.DECIMAL },
    ignoreEOS: {
        label: 'Ignore EOS',
        kind: SamplerFieldKindEnum.BOOLEAN,
        choices: [
            { value: BooleanChoiceEnum.NO, label: 'No' },
            { value: BooleanChoiceEnum.YES, label: 'Yes' },
        ],
        defaultChoice: BooleanChoiceEnum.NO,
    },
};

export const samplerFieldGroups: SamplerFieldGroup[] = [
    {
        id: 'core',
        title: 'Core',
        isAdvanced: false,
        keys: ['temperature', 'topP', 'topK', 'minP', 'repeatLastN', 'repeatPenalty', 'frequencyPenalty', 'presencePenalty', 'seed'],
    },
    { id: 'mirostat', title: 'Mirostat', isAdvanced: true, keys: ['mirostat', 'mirostatEnt', 'mirostatLr'] },
    { id: 'dry', title: 'DRY', isAdvanced: true, keys: ['dryMultiplier', 'dryBase', 'dryAllowedLenght', 'drySequenceBreakers'] },
    { id: 'dynamicTemperature', title: 'Dynamic Temperature', isAdvanced: true, keys: ['dynaTempRange', 'dynaTempExp'] },
    { id: 'xtc', title: 'XTC', isAdvanced: true, keys: ['xtcProbability', 'xtcThreshould'] },
    {
        id: 'other',
        title: 'Other',
        isAdvanced: true,
        keys: ['topNSigma', 'typicalP', 'adaptativeDecay', 'adaptativeTarget', 'ignoreEOS'],
    },
];

export const samplerValueKeys: SamplerValueKey[] = samplerFieldGroups.flatMap(group => group.keys);

const mirostatTuningKeys: ReadonlySet<SamplerValueKey> = new Set(['mirostatEnt', 'mirostatLr']);

export function setSamplerValue (values: SamplerValues, key: SamplerValueKey, value: string): SamplerValues {
    const next: SamplerValues = { ...values, [key]: value };
    const entries = samplerValueKeys
        .map(fieldKey => [fieldKey, next[fieldKey]] as const)
        .filter(([, fieldValue]) => Boolean(fieldValue?.trim()));
    return Object.fromEntries(entries);
}

const wholeNumberKinds: ReadonlySet<SamplerFieldKind> = new Set([SamplerFieldKindEnum.INTEGER, SamplerFieldKindEnum.SEED]);

export function isChoiceField (spec: SamplerFieldSpec): boolean {
    return spec.choices !== undefined;
}

function validateField (spec: SamplerFieldSpec, value: string): string | undefined {
    const number = Number(value);
    if (spec.kind === SamplerFieldKindEnum.DECIMAL && !Number.isFinite(number)) {
        return NOT_A_NUMBER;
    }
    if (wholeNumberKinds.has(spec.kind) && !Number.isInteger(number)) {
        return NOT_A_WHOLE_NUMBER;
    }
    if (isChoiceField(spec) && !spec.choices?.some(choice => choice.value === value)) {
        return UNKNOWN_CHOICE;
    }
    return undefined;
}

export function validateSamplerValues (values: SamplerValues): SamplerValues | undefined {
    const errors: SamplerValues = {};
    samplerValueKeys.forEach(key => {
        const value = values[key];
        if (!value) {
            return;
        }
        const error = validateField(samplerFieldSpecs[key], value.trim());
        if (error) {
            errors[key] = error;
        }
    });
    if (Object.keys(errors).length === 0) {
        return undefined;
    }
    return errors;
}

export function describeSamplerValue (key: SamplerValueKey, value: string | undefined): string {
    if (!value) {
        return 'default';
    }
    const choice = samplerFieldSpecs[key].choices?.find(item => item.value === value);
    return choice?.label ?? value;
}

export function isSamplerFieldVisible (key: SamplerValueKey, values: SamplerValues): boolean {
    if (!mirostatTuningKeys.has(key)) {
        return true;
    }
    const mirostat = values.mirostat ?? MIROSTAT_DISABLED;
    return mirostat !== MIROSTAT_DISABLED;
}

export function getChangedSamplerKeys (values: SamplerValues, savedValues: SamplerValues): SamplerValueKey[] {
    return samplerValueKeys.filter(key => (values[key] ?? '') !== (savedValues[key] ?? ''));
}

export function hasAdvancedChanges (values: SamplerValues, savedValues: SamplerValues): boolean {
    const changedKeys = getChangedSamplerKeys(values, savedValues);
    return samplerFieldGroups
        .filter(group => group.isAdvanced)
        .some(group => group.keys.some(key => changedKeys.includes(key)));
}

export function toSamplerValues (parameters: SamplerParameters | undefined): SamplerValues {
    if (!parameters) {
        return {};
    }
    const entries = samplerValueKeys
        .filter(key => parameters[key] !== undefined)
        .map(key => [key, String(parameters[key])]);
    return Object.fromEntries(entries);
}

function toMirostat (value: string): MirostatEnum {
    if (value === String(MirostatEnum.MIROSTAT1)) {
        return MirostatEnum.MIROSTAT1;
    }
    if (value === String(MirostatEnum.MIROSTAT2)) {
        return MirostatEnum.MIROSTAT2;
    }
    return MirostatEnum.DEFAULT;
}

const textKinds: ReadonlySet<SamplerFieldKind> = new Set([SamplerFieldKindEnum.TEXT, SamplerFieldKindEnum.SEED]);

function toParameterValue (key: SamplerValueKey, value: string): string | number | boolean {
    const { kind } = samplerFieldSpecs[key];
    if (kind === SamplerFieldKindEnum.MIROSTAT) {
        return toMirostat(value);
    }
    if (kind === SamplerFieldKindEnum.BOOLEAN) {
        return value === BooleanChoiceEnum.YES;
    }
    if (textKinds.has(kind)) {
        return value;
    }
    return Number(value);
}

export function toSamplerParameters (values: SamplerValues): SamplerParameters {
    const entries = samplerValueKeys.map(key => {
        const value = values[key]?.trim();
        if (!value) {
            return [key, undefined];
        }
        return [key, toParameterValue(key, value)];
    });
    return Object.fromEntries(entries);
}
