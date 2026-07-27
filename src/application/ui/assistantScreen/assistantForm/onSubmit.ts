import { AssistantFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: AssistantFormData) {
    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
