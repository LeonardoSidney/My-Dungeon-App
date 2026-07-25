import { WorldFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: WorldFormData) {
    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
