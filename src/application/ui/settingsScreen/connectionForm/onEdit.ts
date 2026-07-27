import { ConnectionFormData } from '../constants';
import { editConnectionController } from '@infra/container';

export async function onEdit (formData: ConnectionFormData, getPortNumber: () => number | undefined) {
    if (!formData.id) return;
    if (!formData.createdAt) return;

    const portNumber = getPortNumber();

    await editConnectionController().handle({
        id: formData.id,
        name: formData.name.trim(),
        ip: formData.ip.trim(),
        port: portNumber,
        auth: formData.auth.trim() || undefined,
        createdAt: formData.createdAt,
    });
}
