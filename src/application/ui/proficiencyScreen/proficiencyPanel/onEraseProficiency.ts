import { Proficiency } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from '../proficiencyForm/onErase';
import { loadProficiencies } from '../loadProficiencies';

export async function onEraseProficiency (
    proficiency: Proficiency,
    setProficiencies: Dispatch<SetStateAction<Proficiency[]>>
) {
    await onErase(proficiency.id);
    await loadProficiencies(setProficiencies);
}
