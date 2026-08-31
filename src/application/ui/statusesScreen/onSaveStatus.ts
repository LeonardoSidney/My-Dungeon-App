import { StatusFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './statusForm/onSubmit';
import { setInitialStatusState } from './setInitialStatusState';
import { loadStatuses } from './loadStatuses';
import { Status } from '@domain/entities';

export async function onSaveStatus (
    formData: StatusFormData,
    setStatusFormData: Dispatch<SetStateAction<StatusFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    const response = await onSubmit(formData);
    if (!response || !response.success) return;

    setStatusFormData(setInitialStatusState());
    setShowForm(false);
    await loadStatuses(setStatuses);
}
