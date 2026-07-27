import { AssistantFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: AssistantFormData) {
    if (!formData.name.trim()) {
        throw new Error('Name is required');
    }
    if (!formData.model) {
        throw new Error('Model is required');
    }
    if (!formData.sampler) {
        throw new Error('Sampler is required');
    }

    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
