import { Assistant, WorldMaster } from '@domain/entities';
import {
    CreateWorldMasterControllerParams,
    EditWorldMasterControllerParams,
    ICreateWorldMasterController,
    IEditWorldMasterController,
} from '@domain/controllers';
import { ControllerResponse } from '@application/ui/hooks';
import { FormErrors, WorldMasterFormData } from './constants';

export function toWorldMasterFormState (worldMaster: WorldMaster, assistants: Assistant[]): WorldMasterFormData {
    return {
        id: worldMaster.id,
        name: worldMaster.name,
        activationWord: worldMaster.activationWord,
        prompt: worldMaster.prompt,
        observation: worldMaster.observation ?? '',
        assistant: assistants.find((a) => a.id === worldMaster.assistantId) ?? null,
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

export function toCreateParams (form: WorldMasterFormData, assistantId: string): CreateWorldMasterControllerParams {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
        assistantId,
    };
}

export function toEditParams (form: WorldMasterFormData, assistantId: string): EditWorldMasterControllerParams {
    const observation = form.observation || undefined;
    return {
        id: form.id,
        editParams: {
            name: form.name,
            activationWord: form.activationWord,
            prompt: form.prompt,
            observation,
            assistantId,
        },
    };
}

export function validateWorldMasterForm (form: WorldMasterFormData): FormErrors {
    const errors: FormErrors = {};
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
    editWorldMaster: IEditWorldMasterController
): Promise<ControllerResponse> {
    if (!form.assistant) {
        return Promise.resolve({ success: false, error: 'Assistant is required' });
    }
    if (form.id) {
        return editWorldMaster.handle(toEditParams(form, form.assistant.id));
    }
    return createWorldMaster.handle(toCreateParams(form, form.assistant.id));
}
