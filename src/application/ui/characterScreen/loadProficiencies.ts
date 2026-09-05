import { IGetProficienciesController } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';
import { Proficiency } from '@domain/entities';

export async function loadProficiencies (
    getProficiencies: IGetProficienciesController,
    setProficiencies: Dispatch<SetStateAction<Proficiency[]>>
) {
    try {
        const result = await getProficiencies.handle();
        setProficiencies(result);
    } catch (error) {
        console.error('Failed to load proficiencies:', error);
    }
}
