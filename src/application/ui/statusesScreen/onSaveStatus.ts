import { StatusFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ICreateStatusController, IEditStatusController, IGetStatusesController } from '@domain/controllers';
import { onSubmitStatus } from './onSubmitStatus';
import { setInitialStatusState } from './setInitialStatusState';
import { loadStatuses } from './loadStatuses';
import { Status } from '@domain/entities';

export async function onSaveStatus (
    formData: StatusFormData,
    createStatus: ICreateStatusController,
    editStatus: IEditStatusController,
    getStatuses: IGetStatusesController,
    setStatusFormData: Dispatch<SetStateAction<StatusFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    const response = await onSubmitStatus(formData, createStatus, editStatus);
    if (!response || !response.success) return;

    setStatusFormData(setInitialStatusState());
    setShowForm(false);
    await loadStatuses(getStatuses, setStatuses);
}
