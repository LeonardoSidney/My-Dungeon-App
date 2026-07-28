import { Adventure } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseAdventureController } from '@infra/container';
import { loadAdventures } from './loadAdventures';

export async function onEraseAdventure (
    adventure: Adventure,
    setAdventures: Dispatch<SetStateAction<Adventure[]>>
) {
    try {
        const ctrl = eraseAdventureController();
        await ctrl.handle(adventure.id);
        await loadAdventures(setAdventures);
    } catch (error) {
        console.error('Failed to erase adventure:', error);
    }
}
