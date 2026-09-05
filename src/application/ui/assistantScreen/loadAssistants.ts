import { IGetAssistantsController } from '@domain/controllers';
import { Assistant } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';

export async function loadAssistants (
    getAssistants: IGetAssistantsController,
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    try {
        const result = await getAssistants.handle();
        setAssistants(result);
    } catch (error) {
        console.error('Failed to load assistants:', error);
    }
}
