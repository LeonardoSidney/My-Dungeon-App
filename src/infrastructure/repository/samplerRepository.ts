import { SAMPLER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../domain/constants/general";
import { Sampler } from "../../domain/entities";
import { ILogger } from "../../domain/logger";
import { ISamplerRepository, SaveSamplerParams } from "../../domain/repository";
import { IStorage } from "../../domain/storage";


export class SamplerRepository implements ISamplerRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    public async getSamplers(): Promise<Sampler[]> {
        this.logger.info("Executing SamplerRepository::getSamplers");

        try {
            const samplers = await this.storage.load<Sampler[]>(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`);
            this.logger.debug(`Executing SamplerRepository::getSamplers - samplers: `, samplers);
            return samplers || [];
        } catch (error) {
            this.logger.error(`Error on SamplerRepository::getSamplers: ${error}`);
            throw error;
        }
    }

    public async saveSampler(params: SaveSamplerParams): Promise<boolean> {
        this.logger.info("Executing SamplerRepository::saveSampler");
        this.logger.debug("Executing SamplerRepository::saveSampler - params: ", params);

        try {
            const { sampler } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/${SAMPLER_STORAGE_NAMESPACE}`, sampler);
        } catch (error) {
            this.logger.error('Error on SamplerRepository::saveSampler', error);
            throw error;
        }

        return true;
    }
}
