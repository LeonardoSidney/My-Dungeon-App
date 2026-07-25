import { Dispatch, SetStateAction } from 'react';
import { World } from '@domain/entities';
import { WorldFormData } from './constants';

export function onEditForm (
    world: World,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setWorldFormData: Dispatch<SetStateAction<WorldFormData>>
) {
    setWorldFormData({
        id: world.id,
        name: world.name,
        activationWord: world.activationWord,
        prompt: world.prompt,
        observation: world.observation ?? '',
    });
    setShowForm(true);
}
