import { setInitialProficiencyState } from './setInitialProficiencyState';
import { ProficiencyFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewProficiency (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setProficiencyFormData: Dispatch<SetStateAction<ProficiencyFormData>>,
) {
    setShowForm(true);
    setProficiencyFormData(setInitialProficiencyState());
}
