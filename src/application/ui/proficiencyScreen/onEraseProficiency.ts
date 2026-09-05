import { Alert } from 'react-native';
import { IEraseProficiencyController, IGetProficienciesController } from '@domain/controllers';
import { Proficiency } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadProficiencies } from './loadProficiencies';

export async function onEraseProficiency (
    proficiency: Proficiency,
    eraseProficiency: IEraseProficiencyController,
    getProficiencies: IGetProficienciesController,
    setProficiencies: Dispatch<SetStateAction<Proficiency[]>>
) {
    const response = await eraseProficiency.handle(proficiency.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase proficiency');
        return;
    }
    await loadProficiencies(getProficiencies, setProficiencies);
}
