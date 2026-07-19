import { SAMPLER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISamplerRepository, SaveSamplerParams, EditSamplerParams, EditSamplerRepositoryReturn, EraseSamplerRepositoryReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { SamplerDTO } from '../dto';


export class SamplerRepository implements ISamplerRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findSamplerIndex (samplers: Sampler[], samplerId: string): Promise<number> {
        return samplers.findIndex((s) => s.id === samplerId);
    }

    private removeAt (samplers: Sampler[], index: number): Sampler[] {
        samplers.splice(index, 1);
        return samplers;
    }

    private replaceAt (samplers: Sampler[], index: number, newItem: Sampler): Sampler[] {
        samplers[index] = newItem;
        return samplers;
    }

    async getSamplers (): Promise<Sampler[]> {
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

    async saveSampler (params: SaveSamplerParams): Promise<boolean> {
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

    async editSampler (params: EditSamplerParams): Promise<EditSamplerRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::editSampler');
        this.logger.debug('Executing SamplerRepository::editSampler - params: ', params);

        try {
            const { sampler } = params;
            const existingData = await this.storage.load<Sampler[]>(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`);
            const samplers = existingData || [];
            const index = await this.findSamplerIndex(samplers, sampler.id);

            if (index === -1) {
                this.logger.warning(`Sampler with id ${sampler.id} not found`);
                return { success: false, error: `Sampler with id ${sampler.id} does not exist` };
            }

            const updatedSamplers = this.replaceAt(samplers, index, sampler);
            await this.storage.save(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`, updatedSamplers);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on SamplerRepository::editSampler', error);
            return { success: false, error: 'Failed to edit sampler' };
        }
    }

    async eraseSampler (samplerId: string): Promise<EraseSamplerRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::eraseSampler');
        this.logger.debug('Executing SamplerRepository::eraseSampler - samplerId: ', samplerId);

        try {
            const existingData = await this.storage.load<Sampler[]>(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`);
            const samplers = existingData || [];
            const index = await this.findSamplerIndex(samplers, samplerId);

            if (index === -1) {
                this.logger.warning(`Sampler with id ${samplerId} not found`);
                return { success: false, error: `Sampler with id ${samplerId} does not exist` };
            }

            const filteredSamplers = this.removeAt(samplers, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`, filteredSamplers);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on SamplerRepository::eraseSampler', error);
            return { success: false, error: 'Failed to erase sampler' };
        }
    }
}
