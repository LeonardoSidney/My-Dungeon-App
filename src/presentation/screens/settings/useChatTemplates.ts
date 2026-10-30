import { useCallback, useEffect, useState } from 'react';
import { IAlertController, IGetChatTemplatesController, ISaveChatTemplatesController } from '@domain/controllers';
import { ChatTemplateDefinitions, ChatTemplateFieldErrors, ChatTemplateKey, ChatTemplateOverrides, ChatTemplates } from '@domain/entities';
import { showError } from '@presentation/utils/showError';
import type { ChatTemplateField } from './chatTemplatesForm';

type UseChatTemplatesParams = {
    fields: ChatTemplateField[];
    getChatTemplates: IGetChatTemplatesController;
    saveChatTemplates: ISaveChatTemplatesController;
    alert: IAlertController;
};

function pickFieldTemplates (fields: ChatTemplateField[], templates: ChatTemplates): ChatTemplateOverrides {
    return Object.fromEntries(fields.map(({ key }) => [key, templates[key]]));
}

export function useChatTemplates ({ fields, getChatTemplates, saveChatTemplates, alert }: UseChatTemplatesParams) {
    const [templates, setTemplates] = useState<ChatTemplateOverrides>({});
    const [savedTemplates, setSavedTemplates] = useState<ChatTemplateOverrides>({});
    const [definitions, setDefinitions] = useState<ChatTemplateDefinitions | undefined>(undefined);
    const [errors, setErrors] = useState<ChatTemplateFieldErrors>({});
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let isActive = true;

        getChatTemplates.handle().then(response => {
            if (!isActive) {
                return;
            }

            setIsLoading(false);
            if (!response.success || !response.templates || !response.definitions) {
                setLoadError(response.error ?? 'Failed to load the chat templates');
                return;
            }

            const fieldTemplates = pickFieldTemplates(fields, response.templates);
            setTemplates(fieldTemplates);
            setSavedTemplates(fieldTemplates);
            setDefinitions(response.definitions);
        });

        return () => {
            isActive = false;
        };
    }, [fields, getChatTemplates]);

    const changeTemplate = useCallback((key: ChatTemplateKey, value: string) => {
        setTemplates(current => ({ ...current, [key]: value }));
        setErrors(current => ({ ...current, [key]: undefined }));
    }, []);

    const restoreDefault = useCallback((key: ChatTemplateKey) => {
        if (!definitions) {
            return;
        }

        changeTemplate(key, definitions[key].defaultTemplate);
    }, [changeTemplate, definitions]);

    const save = useCallback(async () => {
        setIsSaving(true);
        const response = await saveChatTemplates.handle({ templates });
        setIsSaving(false);

        if (response.fieldErrors) {
            setErrors(response.fieldErrors);
            return;
        }

        if (!response.success) {
            showError(alert, response.error, 'Failed to save the chat templates');
            return;
        }

        setSavedTemplates(templates);
        setErrors({});
    }, [alert, saveChatTemplates, templates]);

    const hasUnsavedChanges = fields.some(({ key }) => templates[key] !== savedTemplates[key]);

    return { templates, definitions, errors, loadError, isLoading, isSaving, hasUnsavedChanges, changeTemplate, restoreDefault, save };
}
