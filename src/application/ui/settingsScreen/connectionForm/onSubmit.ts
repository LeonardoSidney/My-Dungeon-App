import { ConnectionFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: ConnectionFormData, getPortNumber: () => number | undefined) {
    if (formData.id) {
        return onEdit(formData, getPortNumber);
    }

    return onCreate(formData, getPortNumber);
}
