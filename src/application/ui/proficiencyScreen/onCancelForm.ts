import { setInitialProficiencyState } from './setInitialProficiencyState';
import { ProficiencyFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setProficiencyFormData: Dispatch<SetStateAction<ProficiencyFormData>>,
) {
    setShowForm(false);
    setProficiencyFormData(setInitialProficiencyState());
}
