import { EditItemService } from '@application/services/item';
import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ItemEditParams } from '@domain/services';
import { createItemHelper } from '@test/helpers';

const CREATED_AT = '2026-01-10T08:00:00.000Z';
const PREVIOUS_UPDATED_AT = '2026-02-20T09:30:00.000Z';
const NOW = '2026-06-15T12:00:00.000Z';

const mockLogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function createStoredItem (overrides?: Partial<Item>): Item {
    return createItemHelper({
        id: 'item-1',
        name: 'Iron Sword',
        activationWord: 'sword',
        prompt: 'A rusty iron sword',
        observation: 'Found in the ruins',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<ItemEditParams>): ItemEditParams {
    return {
        name: 'Iron Sword',
        activationWord: 'sword',
        prompt: 'A rusty iron sword',
        observation: 'Found in the ruins',
        ...overrides
    };
}

describe('EditItemService', () => {
    let service: EditItemService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditItemService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editItem({ item: createStoredItem(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditItemService::editItem');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editItem({ item: createStoredItem(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited item with every entity field', () => {
        const editParams: Required<ItemEditParams> = {
            name: 'Steel Sword',
            activationWord: 'blade',
            prompt: 'A sharp steel sword',
            observation: 'Forged by the smith'
        };

        const response = service.editItem({ item: createStoredItem(), editParams });

        expect(response).toStrictEqual({
            success: true,
            item: {
                ...editParams,
                id: 'item-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ name: 'Steel Sword' })
        });

        expect(response.item).toEqual(createStoredItem({
            name: 'Steel Sword',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ activationWord: 'blade' })
        });

        expect(response.item).toEqual(createStoredItem({
            activationWord: 'blade',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ prompt: 'A sharp steel sword' })
        });

        expect(response.item).toEqual(createStoredItem({
            prompt: 'A sharp steel sword',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ observation: 'Forged by the smith' })
        });

        expect(response.item).toEqual(createStoredItem({
            observation: 'Forged by the smith',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the item', () => {
        const response = service.editItem({
            item: createStoredItem({ id: 'item-42' }),
            editParams: createEditParams()
        });

        expect(response.item?.id).toBe('item-42');
    });

    it('should keep the createdAt of the item', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams()
        });

        expect(response.item?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-item' };

        const response = service.editItem({
            item: createStoredItem({ id: 'item-42' }),
            editParams: editParamsWithId
        });

        expect(response.item?.id).toBe('item-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editItem({
            item: createStoredItem(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.item?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editItem({
            item: createStoredItem(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.item?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable item fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editItem({
            item: createStoredItem(),
            editParams: editParamsWithUnknownField
        });

        expect(response.item).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.item?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editItem({
            item: createStoredItem(),
            editParams: editParams
        });

        expect(response.item?.observation).toBeUndefined();
    });

    it('should add the observation to a item that had none', () => {
        const response = service.editItem({
            item: createStoredItem({ observation: undefined }),
            editParams: createEditParams({ observation: 'Forged by the smith' })
        });

        expect(response.item?.observation).toEqual('Forged by the smith');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.item?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams()
        });

        expect(response.item?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given item', () => {
        const item = createStoredItem();

        const response = service.editItem({ item, editParams: createEditParams() });

        expect(response.item).not.toBe(item);
    });

    it('should not mutate the given item', () => {
        const item = createStoredItem();

        service.editItem({
            item,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(item).toStrictEqual(createStoredItem());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editItem({ item: createStoredItem(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '' })
        });

        expect(response.success).toBe(true);
        expect(response.item).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.item?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editItem({
            item: createStoredItem(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.item).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
