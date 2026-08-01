import { SystemPromptFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: SystemPromptFormData) {
    if (!formData.name.trim()) {
        throw new Error('Name is required');
    }
    if (!formData.content.trim()) {
        throw new Error('Content is required');
    }

    if (formData.id) {
        return onEdit(formData);
    }

    return onCreate(formData);
}
