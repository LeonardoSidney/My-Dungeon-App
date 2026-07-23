import { Proficiency } from '@domain/entities';
import { ProficiencyFormData } from '../constants';
import { Dispatch, SetStateAction } from 'react';
import { setInitialProficiencyState } from '../setInitialProficiencyState';

export function onEditForm (
    proficiency: Proficiency,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setProficiencyFormData: Dispatch<SetStateAction<ProficiencyFormData>>,
) {
    setShowForm(true);
    setProficiencyFormData(setInitialProficiencyState());
    setProficiencyFormData({
        id: proficiency.id,
        name: proficiency.name,
        activationWord: proficiency.activationWord,
        prompt: proficiency.prompt,
        observation: proficiency.observation ?? '',
        createdAt: proficiency.createdAt,
        updatedAt: proficiency.updatedAt,
    });
}
