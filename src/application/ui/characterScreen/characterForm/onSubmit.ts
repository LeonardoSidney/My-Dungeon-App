import { CharacterFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: CharacterFormData) {
    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
