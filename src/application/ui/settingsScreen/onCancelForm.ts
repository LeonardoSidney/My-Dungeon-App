import { Dispatch, SetStateAction } from 'react';
import { ConnectionFormData } from './constants';
import { setInitialConnectionState } from './constants';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setConnectionFormData: Dispatch<SetStateAction<ConnectionFormData>>
) {
    setConnectionFormData(setInitialConnectionState());
    setShowForm(false);
}
