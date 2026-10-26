import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdventureDetails } from '@domain/controllers';
import type { AppControllers } from '@presentation/providers/appControllers';
import { showError } from '@presentation/utils/showError';
import type { AdventureFormData } from '../../form/adventureForm';
import type { AdventureFormOptions } from '../../form/useAdventureFormOptions';
import {
    getModifiedSections,
    switchNarratorMode,
    toAdventureSettingsForm,
    toApplySettingsRequest,
    validateAdventureSettings,
    type AdventureSettingsErrors,
    type AdventureSettingsForm,
    type NarratorMode,
} from '../adventureSettingsForm';
import {
    emptyGenerationEdits,
    hasGenerationEdits,
    setAssistantSampler,
    setSamplerFieldValue,
    setVoiceAssistant,
} from '../generationEdits';
import type { SamplerValueKey, SamplerValues } from '../samplerValues';

enum SettingsControllerEnum {
    GET_ADVENTURE = 'getAdventure',
    APPLY_ADVENTURE_SETTINGS = 'applyAdventureSettings',
    ALERT = 'alert',
}

type SettingsControllerKey =
    | SettingsControllerEnum.GET_ADVENTURE
    | SettingsControllerEnum.APPLY_ADVENTURE_SETTINGS
    | SettingsControllerEnum.ALERT;

type SettingsControllers = Pick<AppControllers, SettingsControllerKey>;

type UseAdventureSettingsParams = {
    adventureId: string;
    options: AdventureFormOptions;
    controllers: SettingsControllers;
};

const OPTIONS_LOAD_ERROR = 'Failed to load the adventure options.';

export function useAdventureSettings ({ adventureId, options, controllers }: UseAdventureSettingsParams) {
    const { getAdventure, applyAdventureSettings, alert } = controllers;
    const [source, setSource] = useState<AdventureDetails | null>(null);
    const [sourceError, setSourceError] = useState<string | undefined>(undefined);
    const [saved, setSaved] = useState<AdventureSettingsForm | null>(null);
    const [draft, setDraft] = useState<AdventureSettingsForm | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        let isActive = true;

        getAdventure.handle({ id: adventureId }).then(response => {
            if (!isActive) {
                return;
            }
            if (!response.success || !response.data) {
                setSourceError(response.error ?? 'Failed to load the adventure');
                return;
            }

            setSource(response.data);
        });

        return () => {
            isActive = false;
        };
    }, [adventureId, getAdventure]);

    const hasOptionsError = Object.values(options.errors).some(Boolean);

    useEffect(() => {
        if (saved || !source || options.isLoading || hasOptionsError) {
            return;
        }

        const form = toAdventureSettingsForm(source, options);
        setSaved(form);
        setDraft(form);
    }, [saved, source, options, hasOptionsError]);

    const updateDraft = useCallback((update: (form: AdventureSettingsForm) => AdventureSettingsForm) => {
        setDraft(current => current && update(current));
    }, []);

    const changeAdventure = useCallback((changes: Partial<AdventureFormData>) => {
        updateDraft(form => ({ ...form, adventure: { ...form.adventure, ...changes } }));
    }, [updateDraft]);

    const changeNarratorMode = useCallback((narratorMode: NarratorMode) => {
        updateDraft(form => switchNarratorMode(form, narratorMode));
    }, [updateDraft]);

    const changeVoiceAssistant = useCallback((voiceId: string, assistantId: string | undefined, savedAssistantId: string | undefined) => {
        updateDraft(form => ({ ...form, generation: setVoiceAssistant(form.generation, voiceId, assistantId, savedAssistantId) }));
    }, [updateDraft]);

    const changeAssistantSampler = useCallback((assistantId: string, samplerId: string | undefined, savedSamplerId: string | undefined) => {
        updateDraft(form => ({ ...form, generation: setAssistantSampler(form.generation, assistantId, samplerId, savedSamplerId) }));
    }, [updateDraft]);

    const changeSamplerValue = useCallback((samplerId: string, key: SamplerValueKey, value: string, savedValues: SamplerValues) => {
        updateDraft(form => ({ ...form, generation: setSamplerFieldValue(form.generation, samplerId, key, value, savedValues) }));
    }, [updateDraft]);

    const errors = useMemo<AdventureSettingsErrors>(() => {
        if (!draft) {
            return {};
        }
        return validateAdventureSettings(draft);
    }, [draft]);
    const hasErrors = Object.keys(errors).length > 0;

    const modifiedSections = useMemo(() => {
        if (!saved || !draft) {
            return undefined;
        }
        return getModifiedSections(saved, draft);
    }, [saved, draft]);

    const hasGenerationChanges = Boolean(draft && hasGenerationEdits(draft.generation));
    const hasUnsavedChanges = hasGenerationChanges || Object.values(modifiedSections ?? {}).some(Boolean);

    const discard = useCallback(() => {
        setDraft(saved);
    }, [saved]);

    const apply = useCallback(async (): Promise<boolean> => {
        if (!draft || hasErrors) {
            return false;
        }

        setIsApplying(true);
        const response = await applyAdventureSettings.handle(toApplySettingsRequest(draft));
        setIsApplying(false);
        if (!response.success) {
            showError(alert, response.error, 'Failed to apply the adventure settings');
            return false;
        }

        const applied = { ...draft, generation: emptyGenerationEdits };
        setSaved(applied);
        setDraft(applied);
        return true;
    }, [draft, hasErrors, applyAdventureSettings, alert]);

    const optionsError = hasOptionsError ? OPTIONS_LOAD_ERROR : undefined;
    const loadError = sourceError ?? optionsError;

    return {
        draft,
        loadError,
        errors,
        hasErrors,
        modifiedSections,
        hasUnsavedChanges,
        isApplying,
        changeAdventure,
        changeNarratorMode,
        changeVoiceAssistant,
        changeAssistantSampler,
        changeSamplerValue,
        discard,
        apply,
    };
}
