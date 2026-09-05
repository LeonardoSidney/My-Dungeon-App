import { Alert } from 'react-native';
import { IEraseStatusController, IGetStatusesController } from '@domain/controllers';
import { Status } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadStatuses } from './loadStatuses';

export async function onEraseStatus (
    status: Status,
    eraseStatus: IEraseStatusController,
    getStatuses: IGetStatusesController,
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    const response = await eraseStatus.handle(status.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase status');
        return;
    }
    await loadStatuses(getStatuses, setStatuses);
}
