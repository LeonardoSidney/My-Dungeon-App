import {
    CreateWorldMasterControllerParams,
    EntityOption,
    ICreateWorldMasterController,
    IEditWorldMasterController,
    WorldMasterDetails,
} from '@domain/controllers';
import { ControllerResponse } from '@presentation/hooks';

export type WorldMasterFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    assistant: EntityOption | null;
};

export type WorldMasterFormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};

export function toWorldMasterFormState (worldMaster: WorldMasterDetails, assistants: EntityOption[]): WorldMasterFormData {
    return {
        id: worldMaster.id,
        name: worldMaster.name,
        activationWord: worldMaster.activationWord,
        prompt: worldMaster.prompt,
        observation: worldMaster.observation ?? '',
        assistant: assistants.find(assistant => assistant.id === worldMaster.assistantId) ?? null,
    };
}

export function initialWorldMasterForm (): WorldMasterFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        assistant: null,
    };
}

function toWorldMasterRequest (form: WorldMasterFormData, assistantId: string): CreateWorldMasterControllerParams {
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation: form.observation || undefined,
        assistantId,
    };
}

export function validateWorldMasterForm (form: WorldMasterFormData): WorldMasterFormErrors {
    const errors: WorldMasterFormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.activationWord.trim()) {
        errors.activationWord = 'Activation Word is required';
    }
    if (!form.assistant) {
        errors.assistant = 'Assistant is required';
    }
    if (!form.prompt.trim()) {
        errors.prompt = 'Prompt is required';
    }
    return errors;
}

export function submitWorldMaster (
    form: WorldMasterFormData,
    createWorldMaster: ICreateWorldMasterController,
    editWorldMaster: IEditWorldMasterController,
): Promise<ControllerResponse> {
    if (!form.assistant) {
        return Promise.resolve({ success: false, error: 'Assistant is required' });
    }
    const request = toWorldMasterRequest(form, form.assistant.id);
    if (form.id) {
        return editWorldMaster.handle({ id: form.id, editParams: request });
    }
    return createWorldMaster.handle(request);
}
