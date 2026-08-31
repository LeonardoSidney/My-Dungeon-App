import { Alert } from 'react-native';
import { Status } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from './statusForm/onErase';
import { loadStatuses } from './loadStatuses';

export async function onEraseStatus (
    status: Status,
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    const response = await onErase(status.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase status');
        return;
    }
    await loadStatuses(setStatuses);
}
