import { getAssistantsController } from '@infra/container';
import { Dispatch } from 'react';
import { Assistant } from '@domain/entities';

export async function loadAssistants (
    setAssistants: Dispatch<React.SetStateAction<Assistant[]>>
) {
    try {
        const ctrl = getAssistantsController();
        const result = await ctrl.handle();
        setAssistants(result);
    } catch (error) {
        console.error('Failed to load assistants:', error);
    }
}
