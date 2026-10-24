import type { Sampler } from '../entities';
import type { SamplerListItem } from '../controllers';

export interface IGetSamplersPresenter {
    present (samplers: Sampler[]): SamplerListItem[];
}
