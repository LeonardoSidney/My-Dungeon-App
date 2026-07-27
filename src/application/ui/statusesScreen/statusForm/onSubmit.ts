import { StatusFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: StatusFormData) {
    if (!formData.name.trim()) {
        throw new Error('Name is required');
    }
    if (!formData.activationWord.trim()) {
        throw new Error('Activation Word is required');
    }
    if (!formData.prompt.trim()) {
        throw new Error('Prompt is required');
    }

    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
