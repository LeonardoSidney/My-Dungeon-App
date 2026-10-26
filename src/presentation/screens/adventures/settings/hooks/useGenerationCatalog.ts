import { useCallback, useEffect, useState } from 'react';
import { AssistantDetails, ListControllerResponse } from '@domain/controllers';
import { useEntityList } from '@presentation/hooks';
import type { AppControllers } from '@presentation/providers/appControllers';
import { VoiceSourceEnum, type GenerationVoice } from '../adventureSettingsForm';
import type { GenerationCatalog } from '../voiceRuntime';

enum CatalogControllerEnum {
    GET_WORLD_MASTER = 'getWorldMaster',
    GET_CHARACTER = 'getCharacter',
    GET_ASSISTANT = 'getAssistant',
    GET_ASSISTANTS = 'getAssistants',
    GET_SAMPLERS = 'getSamplers',
    GET_CONNECTIONS = 'getConnections',
}

type CatalogControllerKey =
    | CatalogControllerEnum.GET_WORLD_MASTER
    | CatalogControllerEnum.GET_CHARACTER
    | CatalogControllerEnum.GET_ASSISTANT
    | CatalogControllerEnum.GET_ASSISTANTS
    | CatalogControllerEnum.GET_SAMPLERS
    | CatalogControllerEnum.GET_CONNECTIONS;

type CatalogControllers = Pick<AppControllers, CatalogControllerKey>;

type UseGenerationCatalogParams = {
    voices: GenerationVoice[];
    controllers: CatalogControllers;
};

export type ReloadableGenerationCatalog = GenerationCatalog & {
    reload: () => Promise<void>;
};

export function useGenerationCatalog ({ voices, controllers }: UseGenerationCatalogParams): ReloadableGenerationCatalog {
    const { getWorldMaster, getCharacter, getAssistant, getAssistants, getSamplers, getConnections } = controllers;
    const [profileAssistantIds, setProfileAssistantIds] = useState<Record<string, string | undefined>>({});
    const [profileVersion, setProfileVersion] = useState(0);

    const assistants = useEntityList({
        fetch: async (): Promise<ListControllerResponse<AssistantDetails>> => {
            const list = await getAssistants.handle();
            if (!list.success || !list.items) {
                return { success: false, error: list.error };
            }
            const details = await Promise.all(list.items.map(item => getAssistant.handle({ id: item.id })));
            const items = details
                .map(response => response.data)
                .filter((assistant): assistant is AssistantDetails => assistant !== undefined);
            return { success: true, items };
        },
    });
    const samplers = useEntityList({ fetch: () => getSamplers.handle() });
    const connections = useEntityList({ fetch: () => getConnections.handle() });

    useEffect(() => {
        let isActive = true;

        const loadAssistantId = async (voice: GenerationVoice) => {
            if (voice.source === VoiceSourceEnum.WORLD_MASTER) {
                const response = await getWorldMaster.handle({ id: voice.id });
                return [voice.id, response.data?.assistantId] as const;
            }
            const response = await getCharacter.handle({ id: voice.id });
            return [voice.id, response.data?.assistantId] as const;
        };

        Promise.all(voices.map(loadAssistantId)).then(entries => {
            if (!isActive) {
                return;
            }
            setProfileAssistantIds(Object.fromEntries(entries));
        });

        return () => {
            isActive = false;
        };
    }, [voices, profileVersion, getWorldMaster, getCharacter]);

    const { reload: reloadAssistants } = assistants;
    const { reload: reloadSamplers } = samplers;
    const reload = useCallback(async () => {
        setProfileVersion(version => version + 1);
        await Promise.all([reloadAssistants(), reloadSamplers()]);
    }, [reloadAssistants, reloadSamplers]);

    return {
        assistants: assistants.items,
        samplers: samplers.items,
        connections: connections.items,
        profileAssistantIds,
        reload,
    };
}
