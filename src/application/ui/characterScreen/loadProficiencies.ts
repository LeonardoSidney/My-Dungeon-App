import { getProficienciesController } from '@infra/container';
import { Dispatch } from 'react';
import { Proficiency } from '@domain/entities';

export async function loadProficiencies (
    setProficiencies: Dispatch<React.SetStateAction<Proficiency[]>>
) {
    try {
        const ctrl = getProficienciesController();
        const result = await ctrl.handle();
        setProficiencies(result);
    } catch (error) {
        console.error('Failed to load proficiencies:', error);
    }
}
