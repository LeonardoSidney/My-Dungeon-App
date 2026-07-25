import { AbilityFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: AbilityFormData) {
    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
