import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditItemServiceParams, EditItemServiceReturn, IEditItemService } from '@domain/services';

export class EditItemService implements IEditItemService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editItem (params: EditItemServiceParams): EditItemServiceReturn {
        this.logger.info('Executing EditItemService::editItem');
        const { item, editParams } = params;

        const editedItem: Item = {
            ...item,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            item: editedItem
        };
    }
}
