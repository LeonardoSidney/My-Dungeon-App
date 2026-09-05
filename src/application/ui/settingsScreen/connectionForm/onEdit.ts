import { ConnectionFormData } from '../constants';
import { EditConnectionControllerParams } from '@domain/controllers';
import { editConnectionController } from '@infra/container';

export async function onEdit (formData: ConnectionFormData, getPortNumber: () => number | undefined) {
    if (!formData.id) return;

    const portNumber = getPortNumber();

    const request: EditConnectionControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name.trim(),
            ip: formData.ip.trim(),
            port: portNumber,
            auth: formData.auth.trim() || undefined,
        },
    };

    return editConnectionController().handle(request);
}
