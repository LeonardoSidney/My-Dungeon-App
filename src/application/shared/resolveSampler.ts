import { ISamplerRepository, GetSamplerByIdRepositoryReturn } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';

type SamplerResolver = (samplerId: string) => Promise<GetSamplerByIdRepositoryReturn>;

export function createSamplerResolver (
    samplerRepository: ISamplerRepository,
    getSamplersService: IGetSamplersService
): SamplerResolver {
    return async (samplerId: string) => {
        const response = await samplerRepository.getSamplerById(samplerId);
        if (!response.success) {
            return response;
        }

        return { success: true, sampler: response.sampler ?? getSamplersService.findSystemDefaultSampler(samplerId) };
    };
}
