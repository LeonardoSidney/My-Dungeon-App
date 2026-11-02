import { AlertActionStyleEnum, AlertUseCaseParams } from '@domain/use-cases';
import { confirmDelete, DEFAULT_DELETE_MESSAGE } from '@presentation/utils/confirmDelete';

function buildAlert () {
    const handle = jest.fn<Promise<void>, [AlertUseCaseParams]>();
    return { alert: { handle }, shownAlert: () => handle.mock.calls[0][0] };
}

describe('confirmDelete', () => {
    it('asks for confirmation naming the item', () => {
        const { alert, shownAlert } = buildAlert();

        confirmDelete(alert, { itemName: 'Aria', onConfirm: jest.fn() });

        expect(shownAlert().title).toBe('Delete Aria?');
        expect(shownAlert().message).toBe(DEFAULT_DELETE_MESSAGE);
    });

    it('accepts a custom message', () => {
        const { alert, shownAlert } = buildAlert();

        confirmDelete(alert, { itemName: 'Aria', message: 'Gone forever', onConfirm: jest.fn() });

        expect(shownAlert().message).toBe('Gone forever');
    });

    it('does not delete before the confirmation', () => {
        const { alert } = buildAlert();
        const onConfirm = jest.fn();

        confirmDelete(alert, { itemName: 'Aria', onConfirm });

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('does not delete when the cancel action is chosen', () => {
        const { alert, shownAlert } = buildAlert();
        const onConfirm = jest.fn();

        confirmDelete(alert, { itemName: 'Aria', onConfirm });
        const cancelAction = shownAlert().actions?.find(action => action.style === AlertActionStyleEnum.CANCEL);
        cancelAction?.onPress?.();

        expect(cancelAction?.label).toBe('Cancel');
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('deletes when the destructive action is chosen', () => {
        const { alert, shownAlert } = buildAlert();
        const onConfirm = jest.fn();

        confirmDelete(alert, { itemName: 'Aria', onConfirm });
        const deleteAction = shownAlert().actions?.find(action => action.style === AlertActionStyleEnum.DESTRUCTIVE);
        deleteAction?.onPress?.();

        expect(deleteAction?.label).toBe('Delete');
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});
