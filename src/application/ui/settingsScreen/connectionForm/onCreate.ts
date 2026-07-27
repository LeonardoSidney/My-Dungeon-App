import { ConnectionFormData } from '../constants';
import { createConnectionConfigController } from '@infra/container';

export async function onCreate (formData: ConnectionFormData, getPortNumber: () => number | undefined) {
    const portNumber = getPortNumber();

    await createConnectionConfigController().handle({
        name: formData.name.trim(),
        ip: formData.ip.trim(),
        port: portNumber,
        auth: formData.auth.trim() || undefined,
    });
}
