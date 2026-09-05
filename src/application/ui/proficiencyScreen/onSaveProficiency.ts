import { ProficiencyFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ICreateProficiencyController, IEditProficiencyController, IGetProficienciesController } from '@domain/controllers';
import { onSubmitProficiency } from './onSubmitProficiency';
import { setInitialProficiencyState } from './setInitialProficiencyState';
import { loadProficiencies } from './loadProficiencies';
import { Proficiency } from '@domain/entities';

export async function onSaveProficiency (
    formData: ProficiencyFormData,
    createProficiency: ICreateProficiencyController,
    editProficiency: IEditProficiencyController,
    getProficiencies: IGetProficienciesController,
    setProficiencyFormData: Dispatch<SetStateAction<ProficiencyFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setProficiencies: Dispatch<SetStateAction<Proficiency[]>>
) {
    const response = await onSubmitProficiency(formData, createProficiency, editProficiency);
    if (!response || !response.success) return;

    setProficiencyFormData(setInitialProficiencyState());
    setShowForm(false);
    await loadProficiencies(getProficiencies, setProficiencies);
}
