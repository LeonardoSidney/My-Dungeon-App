import { Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditSamplerServiceParams, EditSamplerServiceReturn, IEditSamplerService } from '@domain/services';

export class EditSamplerService implements IEditSamplerService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editSampler (params: EditSamplerServiceParams): EditSamplerServiceReturn {
        this.logger.info('Executing EditSamplerService::editSampler');
        const { sampler, editParams } = params;

        const editedSampler: Sampler = {
            ...sampler,
            ...editParams,
            updatedAt: new Date()
        };

        this.logger.debug('Sampler edited with success', editedSampler);

        return {
            success: true,
            sampler: editedSampler
        };
    }
}
