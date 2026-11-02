import { Sampler } from '../entities';

export const DEFAULT_SAMPLER: Sampler = {
    id: 'd159dd93-77da-427b-9407-3d695a13e554',
    name: 'top_k',
    observation: 'default generation params',
    topK: 1,
    systemDefault: true,
    createdAt: new Date(1),
    updatedAt: new Date(1)
};

export const LEGACY_SAMPLER_FIELDS = {
    adaptativeDecay: 'adaptiveDecay',
    adaptativeTarget: 'adaptiveTarget',
    dryAllowedLenght: 'dryAllowedLength',
    xtcThreshould: 'xtcThreshold',
};

export const MAX_ADAPTIVE_TARGET = 1;
export const MAX_ADAPTIVE_DECAY = 0.99;

export enum SamplerActionEnum {
    CREATE = 'create',
    EDIT = 'edit',
}
