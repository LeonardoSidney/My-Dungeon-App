import { ProficiencyFormData } from '../constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './onSubmit';
import { setInitialProficiencyState } from '../setInitialProficiencyState';
import { loadProficiencies } from '../loadProficiencies';
import { Proficiency } from '@domain/entities';

export async function onSaveProficiency (
    formData: ProficiencyFormData,
    setProficiencyFormData: Dispatch<SetStateAction<ProficiencyFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setProficiencies: Dispatch<SetStateAction<Proficiency[]>>
) {
    const response = await onSubmit(formData);
    if (!response || !response.success) return;

    setProficiencyFormData(setInitialProficiencyState());
    setShowForm(false);
    await loadProficiencies(setProficiencies);
}
