import { Alert } from 'react-native';
import { IEraseWorldController, IGetWorldsController } from '@domain/controllers';
import { World } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadWorlds } from './loadWorlds';

export async function onEraseWorld (
    world: World,
    eraseWorld: IEraseWorldController,
    getWorlds: IGetWorldsController,
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    const response = await eraseWorld.handle(world.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase world');
        return;
    }
    await loadWorlds(getWorlds, setWorlds);
}
