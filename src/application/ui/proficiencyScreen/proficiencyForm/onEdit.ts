import { ProficiencyFormData } from '../constants';
import { Proficiency } from '@domain/entities';
import { editProficiencyController } from '@infra/container';

export async function onEdit (
    formData: ProficiencyFormData
) {
    const controller = editProficiencyController();
    const proficiency: Proficiency = {
        id: formData.id,
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        createdAt: formData.createdAt ?? new Date(),
        updatedAt: formData.updatedAt ?? new Date(),
    };

    return controller.handle({ proficiency });
}
