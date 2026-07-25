import { StatusFormData } from '../constants';
import { Status } from '@domain/entities';
import { editStatusController } from '@infra/container';

export async function onEdit (
    formData: StatusFormData
) {
    const controller = editStatusController();
    const status: Status = {
        id: formData.id,
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        createdAt: formData.createdAt ?? new Date(),
        updatedAt: formData.updatedAt ?? new Date(),
    };

    return controller.handle({ status });
}
