import { Dispatch, SetStateAction } from 'react';
import { ConnectionFormData } from './constants';
import { setInitialConnectionState } from './constants';

export function onAddNewConnection (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setConnectionFormData: Dispatch<SetStateAction<ConnectionFormData>>
) {
    setConnectionFormData(setInitialConnectionState());
    setShowForm(true);
}
