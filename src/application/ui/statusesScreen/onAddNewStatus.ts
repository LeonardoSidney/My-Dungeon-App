import { setInitialStatusState } from './setInitialStatusState';
import { StatusFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewStatus (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setStatusFormData: Dispatch<SetStateAction<StatusFormData>>,
) {
    setShowForm(true);
    setStatusFormData(setInitialStatusState());
}
