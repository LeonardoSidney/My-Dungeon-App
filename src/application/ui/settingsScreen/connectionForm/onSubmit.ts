import { ConnectionFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: ConnectionFormData, getPortNumber: () => number | undefined) {
    if (!formData.name.trim()) {
        throw new Error('Name is required');
    }
    if (!formData.ip.trim()) {
        throw new Error('IP Address is required');
    }
    if (!formData.port.trim()) {
        throw new Error('Port is required');
    }

    if (formData.id) {
        return onEdit(formData, getPortNumber);
    }

    return onCreate(formData, getPortNumber);
}
