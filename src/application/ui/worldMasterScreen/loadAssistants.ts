import { Dispatch, SetStateAction } from 'react';
import { Assistant } from '@domain/entities';
import { getAssistantsController } from '@infra/container';

export async function loadAssistants (setAssistants: Dispatch<SetStateAction<Assistant[]>>) {
    try {
        const ctrl = getAssistantsController();
        const result = await ctrl.handle();
        setAssistants(result);
    } catch (error) {
        console.error('Failed to load assistants:', error);
    }
}
