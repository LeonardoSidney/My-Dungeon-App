import { IGetAssistantsController } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';
import { Assistant } from '@domain/entities';

export async function loadAssistants (getAssistants: IGetAssistantsController, setAssistants: Dispatch<SetStateAction<Assistant[]>>) {
    try {
        const result = await getAssistants.handle();
        setAssistants(result);
    } catch (error) {
        console.error('Failed to load assistants:', error);
    }
}
