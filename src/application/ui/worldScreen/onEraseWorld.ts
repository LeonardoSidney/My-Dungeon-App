import { Alert } from 'react-native';
import { World } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from './worldForm/onErase';
import { loadWorlds } from './loadWorlds';

export async function onEraseWorld (
    world: World,
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    const response = await onErase(world.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase world');
        return;
    }
    await loadWorlds(setWorlds);
}
