import { setInitialStatusState } from './setInitialStatusState';
import { StatusFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setStatusFormData: Dispatch<SetStateAction<StatusFormData>>,
) {
    setShowForm(false);
    setStatusFormData(setInitialStatusState());
}
