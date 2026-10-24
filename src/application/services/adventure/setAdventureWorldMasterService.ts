import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ISetAdventureWorldMasterService,
    SetAdventureWorldMasterServiceParams,
    SetAdventureWorldMasterServiceReturn,
} from '@domain/services';

export class SetAdventureWorldMasterService implements ISetAdventureWorldMasterService {
    constructor (private readonly logger: ILogger) { }

    setWorldMaster (params: SetAdventureWorldMasterServiceParams): SetAdventureWorldMasterServiceReturn {
        this.logger.info('Executing SetAdventureWorldMasterService::setWorldMaster');

        if (!params.worldMasterId.trim()) {
            return { success: false, error: 'World master id is required' };
        }

        const adventure: Adventure = {
            ...params.adventure,
            worldMasterId: params.worldMasterId,
            characterAsWorldMasterId: undefined,
            updatedAt: new Date(),
        };

        return { success: true, adventure };
    }
}
