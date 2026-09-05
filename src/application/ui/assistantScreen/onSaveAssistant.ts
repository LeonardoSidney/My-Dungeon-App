import { Assistant } from '@domain/entities';
import { ICreateAssistantController, IEditAssistantController, IGetAssistantsController } from '@domain/controllers';
import { AssistantFormData, setInitialAssistantState } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmitAssistant } from './onSubmitAssistant';
import { loadAssistants } from './loadAssistants';

export async function onSaveAssistant (
    assistantStateFormData: AssistantFormData,
    createAssistant: ICreateAssistantController,
    editAssistant: IEditAssistantController,
    getAssistants: IGetAssistantsController,
    setAssistantFormData: Dispatch<SetStateAction<AssistantFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    const response = await onSubmitAssistant(assistantStateFormData, createAssistant, editAssistant);
    if (!response || !response.success) return;

    setAssistantFormData(setInitialAssistantState());
    setShowForm(false);
    await loadAssistants(getAssistants, setAssistants);
}
