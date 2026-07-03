import { SAMPLER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISamplerRepository, SaveSamplerParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { SamplerDTO } from '../dto';


export class SamplerRepository implements ISamplerRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async getSamplers(): Promise<Sampler[]> {
        this.logger.info('Executing SamplerRepository::getSamplers');

        try {
            const samplers: Sampler[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing SamplerRepository::getSamplers - rawData: ', rawData);

            if (rawData) {
                const samplersDTO: SamplerDTO[] = [];
                for (const samplerUnknown of rawData) {
                    const sampler = SamplerDTO.fromStorage(samplerUnknown);
                    if (sampler) {
                        samplersDTO.push(sampler);
                    }
                }

                samplers.push(...samplersDTO.map(dto => dto.toEntity()));

                if (rawData.length !== samplers.length) {
                    this.logger.warning('Some samplers were not converted to entity');
                }
            }

            this.logger.debug('Executing SamplerRepository::getSamplers - samplers: ', samplers);
            return samplers || [];
        } catch (error) {
            this.logger.error('Error on SamplerRepository::getSamplers', error);
            throw error;
        }
    }

    async saveSampler(params: SaveSamplerParams): Promise<boolean> {
        this.logger.info('Executing SamplerRepository::saveSampler');
        this.logger.debug('Executing SamplerRepository::saveSampler - params: ', params);

        try {
            const { sampler } = params;
            const existingData = await this.storage.load<Sampler[]>(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`);
            const samplers: Sampler[] = existingData ? [...existingData, sampler] : [sampler];
            await this.storage.save(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`, samplers);
        } catch (error) {
            this.logger.error('Error on SamplerRepository::saveSampler', error);
            throw error;
        }

        return true;
    }
}
