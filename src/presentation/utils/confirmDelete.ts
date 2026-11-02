import { IAlertController } from '@domain/controllers';
import { AlertActionStyleEnum } from '@domain/use-cases';

export const DEFAULT_DELETE_MESSAGE = 'This action cannot be undone.';

type ConfirmDeleteParams = {
    itemName: string;
    message?: string;
    onConfirm: () => void;
};

export function confirmDelete (alert: IAlertController, { itemName, message = DEFAULT_DELETE_MESSAGE, onConfirm }: ConfirmDeleteParams): void {
    alert.handle({
        title: `Delete ${itemName}?`,
        message,
        actions: [
            { label: 'Cancel', style: AlertActionStyleEnum.CANCEL },
            { label: 'Delete', style: AlertActionStyleEnum.DESTRUCTIVE, onPress: onConfirm },
        ],
    });
}
