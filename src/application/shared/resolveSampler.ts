import { Sampler } from '@domain/entities';
import { ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';

type SamplerResolver = (samplerId: string) => Promise<Sampler | undefined>;

export function createSamplerResolver (
  samplerRepository: ISamplerRepository,
  getSamplersService: IGetSamplersService
): SamplerResolver {
  return async (samplerId: string) => {
    const savedSampler = await samplerRepository.getSamplerById(samplerId);
    if (savedSampler) {
      return savedSampler;
    }
    return getSamplersService.findSystemDefaultSampler(samplerId);
  };
}
