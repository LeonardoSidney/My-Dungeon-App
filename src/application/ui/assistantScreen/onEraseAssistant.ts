import { Assistant } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseAssistantController } from '@infra/container';
import { loadAssistants } from './loadAssistants';

export async function onEraseAssistant (
    assistant: Assistant,
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    try {
        const ctrl = eraseAssistantController();
        await ctrl.handle(assistant.id);
        await loadAssistants(setAssistants);
    } catch (error) {
        console.error('Failed to delete assistant:', error);
    }
}
