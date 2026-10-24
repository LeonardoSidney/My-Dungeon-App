import { SAMPLER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ISamplerRepository,
    SaveSamplerParams,
    SaveSamplerRepositoryReturn,
    GetSamplersRepositoryReturn,
    GetSamplerByIdRepositoryReturn,
    EditSamplerParams,
    EditSamplerRepositoryReturn,
    EraseSamplerRepositoryReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { SamplerDTO } from '@infra/dto';

export class SamplerRepository implements ISamplerRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`;
    }

    async saveSampler (params: SaveSamplerParams): Promise<SaveSamplerRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::saveSampler');
        this.logger.debug('Executing SamplerRepository::saveSampler - params: ', params);

        const loaded = await this.storage.load<Sampler[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SamplerRepository::saveSampler - failed to load samplers', loaded.error);
            return { success: false, error: 'Failed to save sampler' };
        }

        const samplers = [...(loaded.data ?? []), params.sampler];
        const saved = await this.storage.save(this.storageKey, samplers);
        if (!saved.success) {
            this.logger.warning('SamplerRepository::saveSampler - failed to persist samplers', saved.error);
            return { success: false, error: 'Failed to save sampler' };
        }

        return { success: true };
    }

    async getSamplerById (samplerId: string): Promise<GetSamplerByIdRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::getSamplerById');

        const response = await this.getSamplers();
        if (!response.success || !response.samplers) {
            return { success: false, error: response.error };
        }

        return { success: true, sampler: response.samplers.find((s) => s.id === samplerId) };
    }

    async getSamplers (): Promise<GetSamplersRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::getSamplers');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SamplerRepository::getSamplers - failed to load samplers', loaded.error);
            return { success: false, error: 'Failed to load samplers' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing SamplerRepository::getSamplers - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('SamplerRepository::getSamplers - stored samplers are not a list');
            return { success: false, error: 'Failed to load samplers' };
        }

        const samplers: Sampler[] = [];
        for (const samplerUnknown of rawData) {
            const dto = SamplerDTO.fromStorage(samplerUnknown);
            if (dto) {
                samplers.push(dto.toEntity());
            }
        }

        if (rawData.length !== samplers.length) {
            this.logger.warning('Some samplers were not converted to entity');
        }

        this.logger.debug('Executing SamplerRepository::getSamplers - samplers: ', samplers);
        return { success: true, samplers };
    }

    async editSampler (params: EditSamplerParams): Promise<EditSamplerRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::editSampler');
        this.logger.debug('Executing SamplerRepository::editSampler - params: ', params);

        const { sampler } = params;
        const loaded = await this.storage.load<Sampler[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SamplerRepository::editSampler - failed to load samplers', loaded.error);
            return { success: false, error: 'Failed to edit sampler' };
        }

        const samplers = loaded.data ?? [];
        const index = samplers.findIndex((s) => s.id === sampler.id);
        if (index === -1) {
            this.logger.warning(`Sampler with id ${sampler.id} not found`);
            return { success: false, error: `Sampler with id ${sampler.id} does not exist` };
        }

        samplers[index] = sampler;
        const saved = await this.storage.save(this.storageKey, samplers);
        if (!saved.success) {
            this.logger.warning('SamplerRepository::editSampler - failed to persist samplers', saved.error);
            return { success: false, error: 'Failed to edit sampler' };
        }

        return { success: true };
    }

    async eraseSampler (samplerId: string): Promise<EraseSamplerRepositoryReturn> {
        this.logger.info('Executing SamplerRepository::eraseSampler');
        this.logger.debug('Executing SamplerRepository::eraseSampler - samplerId: ', samplerId);

        const loaded = await this.storage.load<Sampler[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SamplerRepository::eraseSampler - failed to load samplers', loaded.error);
            return { success: false, error: 'Failed to erase sampler' };
        }

        const samplers = loaded.data ?? [];
        const index = samplers.findIndex((s) => s.id === samplerId);
        if (index === -1) {
            this.logger.warning(`Sampler with id ${samplerId} not found`);
            return { success: false, error: `Sampler with id ${samplerId} does not exist` };
        }

        samplers.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, samplers);
        if (!saved.success) {
            this.logger.warning('SamplerRepository::eraseSampler - failed to persist samplers', saved.error);
            return { success: false, error: 'Failed to erase sampler' };
        }

        return { success: true };
    }
}
