import type { Sampler } from '../entities';
import type { SamplerDetails } from '../controllers';

export interface IGetSamplerPresenter {
    present (sampler: Sampler): SamplerDetails;
}
