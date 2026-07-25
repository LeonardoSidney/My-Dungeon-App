import { Status } from '@domain/entities';
import { StatusFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { setInitialStatusState } from './setInitialStatusState';

export function onEditForm (
    status: Status,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setStatusFormData: Dispatch<SetStateAction<StatusFormData>>,
) {
    setShowForm(true);
    setStatusFormData(setInitialStatusState());
    setStatusFormData({
        id: status.id,
        name: status.name,
        activationWord: status.activationWord,
        prompt: status.prompt,
        observation: status.observation ?? '',
        createdAt: status.createdAt,
        updatedAt: status.updatedAt,
    });
}
