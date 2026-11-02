import { COLLECTION_LABELS, UNKNOWN_COLLECTION } from '@domain/constants/general';
import { ILogger } from '@domain/logger';
import {
    IValidateUniqueIdsService,
    UniqueIdList,
    ValidateUniqueIdsServiceParams,
    ValidateUniqueIdsServiceReturn,
} from '@domain/services';

export class ValidateUniqueIdsService implements IValidateUniqueIdsService {
    constructor (private readonly logger: ILogger) { }

    validate (params: ValidateUniqueIdsServiceParams): ValidateUniqueIdsServiceReturn {
        this.logger.info('Executing ValidateUniqueIdsService::validate');

        const error = this.findError(params.idLists);
        if (error) {
            this.logger.debug('ValidateUniqueIdsService::validate - repeated id', error);
            return { success: false, error };
        }

        return { success: true };
    }

    private findError (idLists: UniqueIdList[]): string | null {
        for (const { collection, ids } of idLists) {
            const repeatedId = this.findRepeatedId(ids ?? []);
            if (repeatedId !== undefined) {
                const collectionLabel = COLLECTION_LABELS[collection] ?? UNKNOWN_COLLECTION;
                return `Repeated id: ${repeatedId} from ${collectionLabel}`;
            }
        }

        return null;
    }

    private findRepeatedId (ids: string[]): string | undefined {
        return ids.find((id, index) => ids.indexOf(id) !== index);
    }
}
