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
  await onSubmit(formData);
  setStatusFormData(setInitialStatusState());
  setShowForm(false);
  await loadStatuses(setStatuses);
}
