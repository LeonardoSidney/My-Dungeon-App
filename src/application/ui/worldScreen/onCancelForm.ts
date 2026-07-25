import { Dispatch, SetStateAction } from 'react';
import { WorldFormData } from './constants';
import { setInitialWorldState } from './constants';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setWorldFormData: Dispatch<SetStateAction<WorldFormData>>
) {
    setWorldFormData(setInitialWorldState());
    setShowForm(false);
}
