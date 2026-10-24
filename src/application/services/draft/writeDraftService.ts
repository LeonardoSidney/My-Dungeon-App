import { Draft } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWriteDraftService, WriteDraftServiceParams } from '@domain/services';

export class WriteDraftService implements IWriteDraftService {
    constructor (private readonly logger: ILogger) { }

    write (params: WriteDraftServiceParams): Draft {
        this.logger.info('Executing WriteDraftService::write');

        const now = new Date();

        return {
            id: params.draftId,
            content: params.content,
            createdAt: params.existing?.createdAt ?? now,
            updatedAt: now,
        };
    }
}
