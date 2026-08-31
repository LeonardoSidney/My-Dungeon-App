import { Alert } from 'react-native';
import { Adventure } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseAdventureController } from '@infra/container';
import { loadAdventures } from './loadAdventures';

export async function onEraseAdventure (
    adventure: Adventure,
    setAdventures: Dispatch<SetStateAction<Adventure[]>>
) {
    const ctrl = eraseAdventureController();
    const response = await ctrl.handle(adventure.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase adventure');
        return;
    }
    await loadAdventures(setAdventures);
}
